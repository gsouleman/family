import { Router } from 'express';
import { getDistributions, createDistribution } from '../controllers/distributions.controller';
var router = Router();
router.get('/', getDistributions);
router.post('/', createDistribution);
export default router;
