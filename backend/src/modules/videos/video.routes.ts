import { Router } from 'express';
import { videoController } from './video.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/:id', authenticate, videoController.getById);
router.get('/:id/access', authenticate, videoController.checkAccess);

export default router;
