import { Router } from 'express';
import { subjectController } from './subject.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.get('/slug/:slug', subjectController.getBySlug);

// Protected routes
router.get('/:id/tree', authenticate, subjectController.getTree);
router.get('/:id/first-video', authenticate, subjectController.getFirstVideo);

export default router;
