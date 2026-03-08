import { Router } from 'express';
import { progressController } from './progress.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/subjects/:subjectId', authenticate, progressController.getSubjectProgress);
router.get('/videos/:videoId', authenticate, progressController.getVideoProgress);
router.post('/videos/:videoId', authenticate, progressController.updateVideoProgress);
router.post('/videos/:videoId/complete', authenticate, progressController.markCompleted);

export default router;
