import { Router } from 'express';
import { seedData } from '../controllers/seed.controller';

const router = Router();

// Only authenticated users can seed their own data
router.post('/', seedData);

export default router;
