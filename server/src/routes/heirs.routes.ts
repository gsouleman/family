import { Router } from 'express';
import { getHeirs, createHeir, updateHeir, deleteHeir } from '../controllers/heirs.controller';

const router = Router();

router.get('/', getHeirs);
router.post('/', createHeir);
router.put('/:id', updateHeir);
router.delete('/:id', deleteHeir);

export default router;
