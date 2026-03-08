import { Request, Response, NextFunction } from 'express';
import { progressService } from './progress.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ProgressController {
  async getSubjectProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const progress = await progressService.getSubjectProgress(userId, subjectId as string);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getVideoProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { videoId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const progress = await progressService.getVideoProgress(userId, videoId as string);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async updateVideoProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { videoId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const { last_position_seconds, is_completed } = req.body;
      
      const progress = await progressService.updateProgress(userId, videoId as string, {
        last_position_seconds,
        is_completed,
      });
      
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async markCompleted(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { videoId } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      const progress = await progressService.markCompleted(userId, videoId as string);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

export const progressController = new ProgressController();
