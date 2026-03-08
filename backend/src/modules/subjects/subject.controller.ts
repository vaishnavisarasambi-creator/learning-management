import { Request, Response, NextFunction } from 'express';
import { subjectService } from './subject.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class SubjectController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.q as string | undefined;
      
      const result = await subjectService.getAllPublished(page, pageSize, search);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const subject = await subjectService.getById(id as string);
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const subject = await subjectService.getBySlug(slug as string);
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }

  async getTree(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      const tree = await subjectService.getTree(id as string, userId);
      res.json(tree);
    } catch (error) {
      next(error);
    }
  }

  async getFirstVideo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      const videoId = await subjectService.getFirstVideoId(id as string, userId);
      
      if (!videoId) {
        res.status(404).json({ error: 'No videos found in this subject' });
        return;
      }
      
      res.json({ videoId });
    } catch (error) {
      next(error);
    }
  }
}

export const subjectController = new SubjectController();
