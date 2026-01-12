import { Router } from 'express';
import { getTransactions, createTransaction } from '../controllers/transactions.controller';
var router = Router();
router.get('/', getTransactions);
router.post('/', createTransaction);
export default router;
