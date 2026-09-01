import { Response, NextFunction } from 'express';
import {
  AuthenticatedRequest,
  ApiResponse,
  CreateBookingDto,
  UpdateBookingStatusDto,
  CancelBookingDto,
  CreateServiceReportDto,
} from '../types';
import { prisma } from '../config';
import { AppError } from '../middleware/errorHandler';

// Helper to format booking response object for frontend compatibility
function formatBooking(booking: any) {
  let selectedOption = {};
  try {
    selectedOption = JSON.parse(booking.selectedOptionSnapshot || '{}');
  } catch {
    selectedOption = {};
  }

  let addressObj = booking.address;
  if (!addressObj) {
    try {
      addressObj = JSON.parse(booking.addressSnapshot || '{}');
    } catch {
      addressObj = {};
    }
  }

  let partsReplaced: string[] = [];
  if (booking.serviceReport?.partsReplaced) {
    try {
      partsReplaced = JSON.parse(booking.serviceReport.partsReplaced);
    } catch {
      partsReplaced = [];
    }
  }

  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    serviceId: booking.serviceOptionId,
    serviceName: booking.serviceName,
    categoryName: booking.categoryName,
    brandName: booking.brandName || undefined,
    productName: booking.productName || undefined,
    selectedOption,
    date: booking.scheduledDate,
    timeSlot: booking.scheduledTimeSlot,
    address: addressObj,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    totalAmount: booking.total,
    discountAmount: booking.discount,
    taxAmount: booking.tax,
    status: booking.bookingStatus,
    createdAt: booking.createdAt.toISOString(),
    technician: booking.technician
      ? {
          id: booking.technician.id,
          name: booking.technician.name,
          phone: booking.technician.phone,
          rating: booking.technician.rating,
          completedJobs: booking.technician.completedJobs,
          experienceYears: booking.technician.experienceYears,
          specialization: booking.technician.specialization || 'Appliance Specialist',
          avatar: booking.technician.avatar || undefined,
          currentLocation:
            booking.technician.currentLatitude && booking.technician.currentLongitude
              ? {
                  latitude: booking.technician.currentLatitude,
                  longitude: booking.technician.currentLongitude,
                }
              : undefined,
        }
      : undefined,
    serviceReport: booking.serviceReport
      ? {
          technicianNotes: booking.serviceReport.technicianNotes,
          partsReplaced,
          warrantyUntil: booking.serviceReport.warrantyUntil,
          ratingGiven: booking.serviceReport.ratingGiven || undefined,
        }
      : undefined,
    invoice: booking.invoice
      ? {
          id: booking.invoice.id,
          invoiceNumber: booking.invoice.invoiceNumber,
          subtotal: booking.invoice.subtotal,
          discount: booking.invoice.discount,
          taxableAmount: booking.invoice.taxableAmount,
          cgst: booking.invoice.cgst,
          sgst: booking.invoice.sgst,
          total: booking.invoice.total,
          paymentMethod: booking.invoice.paymentMethod,
          paymentStatus: booking.invoice.paymentStatus,
          issuedAt: booking.invoice.issuedAt.toISOString(),
        }
      : undefined,
    notes: booking.notes || undefined,
    cancellationReason: booking.cancellationReason || undefined,
    statusHistory: booking.statusHistory?.map((h: any) => ({
      id: h.id,
      status: h.status,
      note: h.note || undefined,
      timestamp: h.timestamp.toISOString(),
    })),
  };
}

export const bookingController = {
  /**
   * GET /api/bookings
   * List authenticated user's bookings with optional status filter
   */
  getBookings: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { status } = req.query;
      const where: any = { userId: req.user.id };

      if (status && status !== 'all') {
        if (status === 'active') {
          where.bookingStatus = {
            in: ['confirmed', 'technician_assigned', 'on_the_way', 'in_progress'],
          };
        } else if (status === 'completed') {
          where.bookingStatus = 'completed';
        } else if (status === 'cancelled') {
          where.bookingStatus = 'cancelled';
        } else {
          where.bookingStatus = String(status);
        }
      }

      const bookings = await prisma.booking.findMany({
        where,
        include: {
          address: true,
          technician: true,
          serviceReport: true,
          invoice: true,
          statusHistory: {
            orderBy: { timestamp: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const formatted = bookings.map(formatBooking);

      res.status(200).json({
        success: true,
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/bookings/:id
   * Get single booking details (validates ownership)
   */
  getBookingById: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;

      const booking = await prisma.booking.findFirst({
        where: {
          id: { equals: id },
          userId: req.user.id, // Strict ownership check
        },
        include: {
          address: true,
          technician: true,
          serviceReport: true,
          invoice: true,
          statusHistory: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });

      if (!booking) {
        throw new AppError(`Booking #${id} not found or access denied.`, 404);
      }

      res.status(200).json({
        success: true,
        data: formatBooking(booking),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/bookings
   * Create a new booking with authoritative server-side price computation
   */
  createBooking: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const dto: CreateBookingDto = req.body;

      if (!dto.scheduledDate || !dto.scheduledTimeSlot) {
        throw new AppError('Appointment date and time slot are required.', 400);
      }

      // Authoritative service lookup from database
      const serviceOption = await prisma.serviceOption.findUnique({
        where: { id: dto.serviceOptionId || 'ac-foam-jet' },
        include: { category: true },
      });

      if (!serviceOption) {
        throw new AppError('The selected service package was not found in catalog.', 400);
      }

      // Address resolution
      let addressId: string | undefined = dto.addressId;
      let addressSnapshotObj: any = null;

      if (addressId) {
        const foundAddress = await prisma.address.findFirst({
          where: { id: addressId, userId: req.user.id },
        });
        if (foundAddress) {
          addressSnapshotObj = foundAddress;
        }
      }

      if (!addressSnapshotObj && dto.address) {
        const createdAddr = await prisma.address.create({
          data: {
            userId: req.user.id,
            label: (dto.address.label as any) || 'Home',
            street: dto.address.street,
            apartment: dto.address.apartment || null,
            city: dto.address.city,
            state: dto.address.state || 'Haryana',
            pincode: dto.address.pincode,
            country: dto.address.country || 'India',
            isDefault: true,
          },
        });
        addressId = createdAddr.id;
        addressSnapshotObj = createdAddr;
      }

      if (!addressSnapshotObj) {
        // Fallback to user's default address
        const defaultAddr = await prisma.address.findFirst({
          where: { userId: req.user.id },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        if (defaultAddr) {
          addressId = defaultAddr.id;
          addressSnapshotObj = defaultAddr;
        } else {
          throw new AppError('Please provide a valid service address.', 400);
        }
      }

      // Auto-assign highest-rated available technician
      const technician = await prisma.technician.findFirst({
        where: { available: true },
        orderBy: [{ rating: 'desc' }, { completedJobs: 'desc' }],
      });

      // Authoritative calculations
      const subtotal = serviceOption.price;
      const discount = 0;
      const taxableAmount = Math.round((subtotal / 1.18) * 100) / 100;
      const totalTax = Math.round((subtotal - taxableAmount) * 100) / 100;
      const cgst = Math.round((totalTax / 2) * 100) / 100;
      const sgst = Math.round((totalTax / 2) * 100) / 100;
      const total = subtotal;

      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const bookingId = `ZEV-2026-${randomSuffix}`;
      const bookingNumber = `BK-${randomSuffix}`;
      const invoiceNumber = `INV-${randomSuffix}`;

      const selectedOptionSnapshot = JSON.stringify({
        id: serviceOption.id,
        title: serviceOption.title,
        description: serviceOption.description,
        duration: serviceOption.duration,
        price: serviceOption.price,
        originalPrice: serviceOption.originalPrice,
        rating: serviceOption.rating,
        reviewCount: serviceOption.reviewCount,
        features: JSON.parse(serviceOption.features || '[]'),
        included: JSON.parse(serviceOption.included || '[]'),
        excluded: JSON.parse(serviceOption.excluded || '[]'),
        warrantyDays: serviceOption.warrantyDays,
      });

      const isCOD =
        dto.paymentMethod?.toLowerCase().includes('cash') ||
        dto.paymentMethod?.toLowerCase().includes('completion') ||
        dto.paymentMethod === 'cod';

      // Create Booking in Transaction with History and Invoice
      const createdBooking = await prisma.booking.create({
        data: {
          id: bookingId,
          bookingNumber,
          userId: req.user.id,
          categoryId: serviceOption.categoryId,
          categoryName: serviceOption.category.name,
          serviceOptionId: serviceOption.id,
          serviceName: serviceOption.title,
          selectedOptionSnapshot,
          addressId: addressId || null,
          addressSnapshot: JSON.stringify(addressSnapshotObj),
          scheduledDate: dto.scheduledDate,
          scheduledTimeSlot: dto.scheduledTimeSlot,
          paymentMethod: dto.paymentMethod || 'UPI Instant Pay',
          paymentStatus: isCOD ? 'cod' : 'paid',
          bookingStatus: 'confirmed',
          subtotal,
          discount,
          tax: totalTax,
          total,
          notes: dto.notes || null,
          technicianId: technician ? technician.id : null,
          statusHistory: {
            create: [
              {
                status: 'confirmed',
                note: 'Booking registered and verified successfully.',
              },
            ],
          },
          invoice: {
            create: {
              invoiceNumber,
              subtotal,
              discount,
              taxableAmount,
              cgst,
              sgst,
              total,
              paymentMethod: dto.paymentMethod || 'UPI Instant Pay',
              paymentStatus: isCOD ? 'cod' : 'paid',
            },
          },
        },
        include: {
          address: true,
          technician: true,
          invoice: true,
          statusHistory: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: formatBooking(createdBooking),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/bookings/:id/status
   * Update booking status and append to status history
   */
  updateBookingStatus: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const { status, note }: UpdateBookingStatusDto = req.body;

      const existing = await prisma.booking.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        throw new AppError(`Booking #${id} not found or access denied.`, 404);
      }

      // Add status history entry and update status
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          bookingStatus: status,
          statusHistory: {
            create: {
              status,
              note: note || `Status updated to ${status}`,
            },
          },
        },
        include: {
          address: true,
          technician: true,
          serviceReport: true,
          invoice: true,
          statusHistory: true,
        },
      });

      // If completed, ensure service report exists
      if (status === 'completed') {
        const existingReport = await prisma.serviceReport.findUnique({
          where: { bookingId: id },
        });
        if (!existingReport) {
          await prisma.serviceReport.create({
            data: {
              bookingId: id,
              technicianNotes:
                'Full multi-point inspection completed. System cleaned, tested, and full performance verified.',
              partsReplaced: JSON.stringify(['Filter Seal Ring']),
              warrantyUntil: '30 Days from today',
              ratingGiven: 5,
            },
          });
        }
      }

      const fullUpdated = await prisma.booking.findUnique({
        where: { id },
        include: {
          address: true,
          technician: true,
          serviceReport: true,
          invoice: true,
          statusHistory: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: formatBooking(fullUpdated),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/bookings/:id/cancel
   * Cancel booking (enforces authorization, records cancellation reason and history)
   */
  cancelBooking: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const { reason }: CancelBookingDto = req.body;

      const existing = await prisma.booking.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        throw new AppError(`Booking #${id} not found or access denied.`, 404);
      }

      if (existing.bookingStatus === 'completed') {
        throw new AppError('Completed bookings cannot be cancelled.', 400);
      }

      const cancellationReason = reason || 'Cancelled by customer';

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          bookingStatus: 'cancelled',
          cancellationReason,
          statusHistory: {
            create: {
              status: 'cancelled',
              note: `Cancelled: ${cancellationReason}`,
            },
          },
        },
        include: {
          address: true,
          technician: true,
          serviceReport: true,
          invoice: true,
          statusHistory: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully.',
        data: formatBooking(updated),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/bookings/:id/invoice
   * Get authoritative invoice for booking
   */
  getInvoice: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;

      const booking = await prisma.booking.findFirst({
        where: { id, userId: req.user.id },
        include: {
          invoice: true,
          address: true,
          user: true,
        },
      });

      if (!booking || !booking.invoice) {
        throw new AppError(`Invoice for booking #${id} not found or access denied.`, 404);
      }

      res.status(200).json({
        success: true,
        data: {
          bookingId: booking.id,
          customerName: booking.user.name,
          customerAddress: booking.address
            ? `${booking.address.street}, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`
            : 'Service Address',
          serviceName: booking.serviceName,
          categoryName: booking.categoryName,
          brandName: booking.brandName,
          invoiceNumber: booking.invoice.invoiceNumber,
          subtotal: booking.invoice.subtotal,
          discount: booking.invoice.discount,
          taxableAmount: booking.invoice.taxableAmount,
          cgst: booking.invoice.cgst,
          sgst: booking.invoice.sgst,
          total: booking.invoice.total,
          paymentMethod: booking.invoice.paymentMethod,
          paymentStatus: booking.invoice.paymentStatus,
          issuedAt: booking.invoice.issuedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/bookings/:id/report
   * Get service completion report
   */
  getReport: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const booking = await prisma.booking.findFirst({
        where: { id, userId: req.user.id },
        include: { serviceReport: true },
      });

      if (!booking || !booking.serviceReport) {
        throw new AppError(`Service report for booking #${id} not found.`, 404);
      }

      let partsReplaced: string[] = [];
      try {
        partsReplaced = JSON.parse(booking.serviceReport.partsReplaced || '[]');
      } catch {
        partsReplaced = [];
      }

      res.status(200).json({
        success: true,
        data: {
          technicianNotes: booking.serviceReport.technicianNotes,
          partsReplaced,
          warrantyUntil: booking.serviceReport.warrantyUntil,
          ratingGiven: booking.serviceReport.ratingGiven || undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/bookings/:id/report
   * Add/update service completion report and rating
   */
  saveReport: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const dto: CreateServiceReportDto = req.body;

      const booking = await prisma.booking.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!booking) {
        throw new AppError(`Booking #${id} not found or access denied.`, 404);
      }

      const report = await prisma.serviceReport.upsert({
        where: { bookingId: id },
        create: {
          bookingId: id,
          technicianNotes: dto.technicianNotes || 'Service completed successfully.',
          partsReplaced: JSON.stringify(dto.partsReplaced || []),
          warrantyUntil: dto.warrantyUntil || '30 Days from today',
          ratingGiven: dto.ratingGiven,
        },
        update: {
          ...(dto.technicianNotes ? { technicianNotes: dto.technicianNotes } : {}),
          ...(dto.partsReplaced ? { partsReplaced: JSON.stringify(dto.partsReplaced) } : {}),
          ...(dto.warrantyUntil ? { warrantyUntil: dto.warrantyUntil } : {}),
          ...(dto.ratingGiven !== undefined ? { ratingGiven: dto.ratingGiven } : {}),
        },
      });

      res.status(200).json({
        success: true,
        message: 'Service report saved',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },
};
