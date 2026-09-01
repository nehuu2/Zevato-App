import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { prisma } from '../config';
import { AppError } from '../middleware/errorHandler';

export const catalogController = {
  /**
   * GET /api/categories
   * List all service categories
   */
  getCategories: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: [{ popular: 'desc' }, { name: 'asc' }],
      });

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/brands?categoryId=ac
   * List appliance brands, optionally filtered by category
   */
  getBrands: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { categoryId } = req.query;

      const rawBrands = await prisma.brand.findMany({
        orderBy: { name: 'asc' },
      });

      const parsedBrands = rawBrands.map((b) => ({
        ...b,
        categories: JSON.parse(b.categories || '[]') as string[],
      }));

      const filtered = categoryId
        ? parsedBrands.filter((b) => b.categories.includes(String(categoryId)))
        : parsedBrands;

      res.status(200).json({
        success: true,
        data: filtered,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products?categoryId=ac&brandId=daikin
   * List products, optionally filtered by category and brand
   */
  getProducts: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { categoryId, brandId } = req.query;

      const where: any = {};
      if (categoryId) where.categoryId = String(categoryId);
      if (brandId) where.brandId = String(brandId);

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
        },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   * Get single product details
   */
  getProductById: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
        },
      });

      if (!product) {
        throw new AppError(`Product #${id} not found`, 404);
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/services?categoryId=ac
   * List service options / packages, optionally filtered by category
   */
  getServices: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { categoryId } = req.query;
      const where = categoryId ? { categoryId: String(categoryId) } : {};

      const options = await prisma.serviceOption.findMany({
        where,
        orderBy: [{ isPopular: 'desc' }, { price: 'asc' }],
      });

      const parsedOptions = options.map((opt) => ({
        ...opt,
        features: JSON.parse(opt.features || '[]'),
        included: JSON.parse(opt.included || '[]'),
        excluded: JSON.parse(opt.excluded || '[]'),
      }));

      res.status(200).json({
        success: true,
        data: parsedOptions,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/services/:id
   * Get single service package details
   */
  getServiceById: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const option = await prisma.serviceOption.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!option) {
        throw new AppError(`Service option #${id} not found`, 404);
      }

      const parsed = {
        ...option,
        features: JSON.parse(option.features || '[]'),
        included: JSON.parse(option.included || '[]'),
        excluded: JSON.parse(option.excluded || '[]'),
      };

      res.status(200).json({
        success: true,
        data: parsed,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/technicians
   * List technicians
   */
  getTechnicians: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const technicians = await prisma.technician.findMany({
        orderBy: [{ rating: 'desc' }, { completedJobs: 'desc' }],
      });

      res.status(200).json({
        success: true,
        data: technicians,
      });
    } catch (error) {
      next(error);
    }
  },
};
