import { Router } from 'express';
import { getUsers, createUserProfile, updateUserProfile, deleteUserProfile, getProfile } from '../controllers/user.controller';

const router = Router();

router.get('/me', getProfile);
router.get('/', getUsers);
router.post('/', createUserProfile);
router.put('/:id', updateUserProfile);
router.delete('/:id', deleteUserProfile);

export default router;
