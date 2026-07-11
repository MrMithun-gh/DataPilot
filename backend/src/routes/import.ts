import { Router } from 'express';
import { handleImport } from '../controllers/importController';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

router.post('/', uploadMiddleware, handleImport);

export default router;
