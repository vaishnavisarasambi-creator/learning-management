import { Request, Response, NextFunction } from 'express';
import { videoService } from './video.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class VideoController {
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const video = await videoService.getVideoDetail(id as string, userId);
      res.json(video);
    } catch (error) {
      next(error);
    }
  }

  async checkAccess(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const access = await videoService.checkVideoAccess(id as string, userId);
      res.json(access);
    } catch (error) {
      next(error);
    }
  }
}

export const videoController = new VideoController();
