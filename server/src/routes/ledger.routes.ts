import { Router } from 'express';
import { getLedgerEntries, createLedgerEntry, updateLedgerEntry, deleteLedgerEntry } from '../controllers/ledger.controller';

const router = Router();

// Middleware is applied globally in index.ts
router.get('/', getLedgerEntries);
router.post('/', createLedgerEntry);
router.put('/:id', updateLedgerEntry);
router.delete('/:id', deleteLedgerEntry);

export default router;
