import { Router } from 'express';
import { getDistributions, createDistribution } from '../controllers/distributions.controller';

const router = Router();

router.get('/', getDistributions);
router.post('/', createDistribution);

export default router;
