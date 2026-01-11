import { Router } from 'express';
import { getLedgerEntries, createLedgerEntry, updateLedgerEntry, deleteLedgerEntry } from '../controllers/ledger.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', getLedgerEntries);
router.post('/', createLedgerEntry);
router.put('/:id', updateLedgerEntry);
router.delete('/:id', deleteLedgerEntry);

export default router;
