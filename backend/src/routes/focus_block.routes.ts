import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getFocusBlocks, getPendingBlocks, updateFocusBlock, deleteFocusBlock } from '../controllers/focus_block.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFocusBlocks);
router.get('/pending', getPendingBlocks);
router.put('/:id', updateFocusBlock);
router.delete('/:id', deleteFocusBlock);

export default router;
