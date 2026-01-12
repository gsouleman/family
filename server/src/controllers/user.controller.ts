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
        res.status(500).json({ error: 'Failed to fetch users', details: String(error) });
    }
};

export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const { id, email, full_name, role, account_type, status, phone, is_2fa_enabled, two_factor_method } = req.body;

        // Upsert to ensure we don't fail if user already exists (e.g. from middleware sync)
        const user = await prisma.profile.upsert({
            where: { id: id || 'unknown' }, // ID should come from Supabase Auth
            update: {
                full_name,
                role,
                account_type,
                status,

                email, // Allow updating email if changed
                phone,
                is_2fa_enabled,
                two_factor_method
            },
            create: {
                id,
                email,
                full_name,
                role: role || 'user',
                account_type: account_type || 'family',

                status: status || 'active',
                phone,
                is_2fa_enabled,
                two_factor_method: two_factor_method || 'email'
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: 'Failed to create user profile', details: String(error) });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { full_name, role, account_type, status, phone, is_2fa_enabled, two_factor_method } = req.body;

        const user = await prisma.profile.update({
            where: { id },
            data: {
                full_name,
                role,
                account_type,
                status,
                phone,
                is_2fa_enabled,
                two_factor_method
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile (v1.2.1)', details: String(error), version: '1.2.1' });
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
        res.status(500).json({ error: 'Failed to delete user profile', details: String(error) });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.profile.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile', details: String(error) });
    }
};
