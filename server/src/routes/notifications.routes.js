import { Router } from 'express';
import { getNotifications, createNotification, markRead } from '../controllers/notifications.controller';
var router = Router();
router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markRead);
export default router;
