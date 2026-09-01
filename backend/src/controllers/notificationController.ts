import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../config';
import { AppError } from '../middleware/errorHandler';

export const notificationController = {
  /**
   * Register or update an Expo Push Token for the authenticated user
   */
  registerToken: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { token, platform = 'mobile' } = req.body;
      if (!token || typeof token !== 'string') {
        throw new AppError('Push device token is required', 400);
      }

      // Upsert push token for the authenticated user
      const record = await prisma.pushDeviceToken.upsert({
        where: { token },
        update: {
          userId: req.user.id,
          platform,
          updatedAt: new Date(),
        },
        create: {
          userId: req.user.id,
          token,
          platform,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Device push token registered successfully',
        data: {
          id: record.id,
          platform: record.platform,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Unregister an Expo Push Token
   */
  unregisterToken: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { token } = req.body;
      if (!token) {
        throw new AppError('Push device token is required', 400);
      }

      await prisma.pushDeviceToken.deleteMany({
        where: {
          token,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Device push token removed successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

export default notificationController;
