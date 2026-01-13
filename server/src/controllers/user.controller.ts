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
        const { full_name, role, account_type, status, phone, is_2fa_enabled, two_factor_method, email } = req.body;

        // Validation: Check if user exists first
        const existingProfile = await prisma.profile.findUnique({
            where: { id }
        });

        if (!existingProfile) {
            return res.status(404).json({
                error: 'User profile not found',
                details: `No profile exists with ID: ${id}`,
                field: 'id'
            });
        }

        // Validate email if being updated
        if (email && email !== existingProfile.email) {
            const emailExists = await prisma.profile.findUnique({
                where: { email: email.toLowerCase().trim() }
            });

            if (emailExists && emailExists.id !== id) {
                return res.status(400).json({
                    error: 'Email already in use',
                    details: `The email ${email} is already registered to another account`,
                    field: 'email'
                });
            }
        }

        // Validate phone if 2FA via SMS is enabled
        if (is_2fa_enabled && two_factor_method === 'phone' && !phone) {
            return res.status(400).json({
                error: 'Phone number required',
                details: 'Phone number is required when enabling 2FA via SMS',
                field: 'phone'
            });
        }

        // Build update object with only provided fields
        const updateData: any = {};
        if (full_name !== undefined) updateData.full_name = full_name;
        if (role !== undefined) updateData.role = role;
        if (account_type !== undefined) updateData.account_type = account_type;
        if (status !== undefined) updateData.status = status;
        if (phone !== undefined) updateData.phone = phone || null;
        if (is_2fa_enabled !== undefined) updateData.is_2fa_enabled = is_2fa_enabled;
        if (two_factor_method !== undefined) updateData.two_factor_method = two_factor_method;
        if (email !== undefined) updateData.email = email.toLowerCase().trim();

        // Perform the update
        const user = await prisma.profile.update({
            where: { id },
            data: updateData
        });

        console.log(`✅ Successfully updated profile for user: ${user.email}`);
        res.json(user);

    } catch (error: any) {
        console.error('❌ Error updating user profile:', error);
        console.error('Error Stack:', error.stack);
        console.error('Request body:', req.body);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: 'Unique constraint violation',
                details: 'Email address is already in use',
                field: 'email',
                code: error.code
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Record not found',
                details: 'User profile does not exist',
                field: 'id',
                code: error.code
            });
        }

        // Generic error response
        res.status(500).json({
            error: 'Failed to update user profile',
            details: error.message || String(error),
            code: error.code
        });
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
