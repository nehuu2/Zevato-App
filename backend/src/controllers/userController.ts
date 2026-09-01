import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, CreateAddressDto, UpdateProfileDto } from '../types';
import { prisma } from '../config';
import { AppError } from '../middleware/errorHandler';

export const userController = {
  /**
   * GET /api/me
   * Get profile of the authenticated user
   */
  getProfile: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          addresses: {
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
          },
        },
      });

      if (!user) {
        throw new AppError('User not found in database.', 404);
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/me
   * Update profile information for authenticated user
   */
  updateProfile: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const updates: UpdateProfileDto = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(updates.name !== undefined ? { name: updates.name.trim() } : {}),
          ...(updates.phone !== undefined ? { phone: updates.phone.trim() } : {}),
          ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
          ...(updates.profileCompleted !== undefined ? { profileCompleted: Boolean(updates.profileCompleted) } : {}),
        },
        include: {
          addresses: {
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/addresses
   * List all addresses for authenticated user
   */
  getAddresses: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const addresses = await prisma.address.findMany({
        where: { userId: req.user.id },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });

      res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/addresses
   * Create a new address for authenticated user
   */
  createAddress: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const dto: CreateAddressDto = req.body;
      if (!dto.street || !dto.city || !dto.pincode) {
        throw new AppError('Street, city, and pincode are required.', 400);
      }

      // Check if user currently has any addresses
      const addressCount = await prisma.address.count({
        where: { userId: req.user.id },
      });

      const shouldBeDefault = dto.isDefault || addressCount === 0;

      // If this will be default, unset existing default addresses
      if (shouldBeDefault && addressCount > 0) {
        await prisma.address.updateMany({
          where: { userId: req.user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const created = await prisma.address.create({
        data: {
          userId: req.user.id,
          label: dto.label || 'Home',
          street: dto.street.trim(),
          apartment: dto.apartment?.trim() || null,
          city: dto.city.trim(),
          state: dto.state?.trim() || 'Haryana',
          pincode: dto.pincode.trim(),
          country: dto.country?.trim() || 'India',
          isDefault: shouldBeDefault,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/addresses/:id
   * Update an existing address owned by authenticated user
   */
  updateAddress: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const dto: Partial<CreateAddressDto> = req.body;

      const existing = await prisma.address.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== req.user.id) {
        throw new AppError('Address not found or access denied.', 404);
      }

      if (dto.isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const updated = await prisma.address.update({
        where: { id },
        data: {
          ...(dto.label !== undefined ? { label: dto.label } : {}),
          ...(dto.street !== undefined ? { street: dto.street.trim() } : {}),
          ...(dto.apartment !== undefined ? { apartment: dto.apartment?.trim() || null } : {}),
          ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
          ...(dto.state !== undefined ? { state: dto.state.trim() } : {}),
          ...(dto.pincode !== undefined ? { pincode: dto.pincode.trim() } : {}),
          ...(dto.country !== undefined ? { country: dto.country.trim() } : {}),
          ...(dto.isDefault !== undefined ? { isDefault: Boolean(dto.isDefault) } : {}),
        },
      });

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/addresses/:id
   * Delete an address owned by authenticated user
   */
  deleteAddress: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const existing = await prisma.address.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== req.user.id) {
        throw new AppError('Address not found or access denied.', 404);
      }

      await prisma.address.delete({
        where: { id },
      });

      // If the deleted address was default, promote another address to default
      if (existing.isDefault) {
        const nextAddress = await prisma.address.findFirst({
          where: { userId: req.user.id },
          orderBy: { createdAt: 'desc' },
        });
        if (nextAddress) {
          await prisma.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/addresses/:id/default
   * Set address as default for authenticated user
   */
  setDefaultAddress: async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { id } = req.params;
      const existing = await prisma.address.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== req.user.id) {
        throw new AppError('Address not found or access denied.', 404);
      }

      // Unset all existing defaults
      await prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false },
      });

      // Set target as default
      const updated = await prisma.address.update({
        where: { id },
        data: { isDefault: true },
      });

      res.status(200).json({
        success: true,
        message: 'Default address updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
