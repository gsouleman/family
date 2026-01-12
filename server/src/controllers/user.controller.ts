import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.profile.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const { id, email, full_name, role, account_type, status } = req.body;

        // Upsert to ensure we don't fail if user already exists (e.g. from middleware sync)
        const user = await prisma.profile.upsert({
            where: { id: id || 'unknown' }, // ID should come from Supabase Auth
            update: {
                full_name,
                role,
                account_type,
                status,
                email // Allow updating email if changed
            },
            create: {
                id,
                email,
                full_name,
                role: role || 'user',
                account_type: account_type || 'family',
                status: status || 'active'
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: 'Failed to create user profile' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await prisma.profile.update({
            where: { id },
            data: updates
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.profile.delete({
            where: { id }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ error: 'Failed to delete user profile' });
    }
};
