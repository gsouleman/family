import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthService } from '../services/auth.service.js';

const router = Router();

/**
 * POST /api/auth/login
 * Initial login - returns 2FA status
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user profile
        const profile = await prisma.profile.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: {
                id: true,
                email: true,
                full_name: true,
                is_2fa_enabled: true,
                two_factor_method: true,
                phone: true,
                role: true
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if 2FA is enabled
        if (profile.is_2fa_enabled) {
            // Generate and store OTP code
            const code = AuthService.generateOTP();
            await AuthService.storeOTPCode(profile.id, code);

            // Send code via configured method
            if (profile.two_factor_method === 'phone' && profile.phone) {
                const result = await AuthService.sendOTPSMS(profile.phone, code);
                if (!result.success) {
                    return res.status(500).json({ error: result.error });
                }
            } else {
                // Default to email
                const result = await AuthService.sendOTPEmail(profile.email, code);
                if (!result.success) {
                    return res.status(500).json({ error: result.error });
                }
            }

            return res.json({
                needs2FA: true,
                method: profile.two_factor_method,
                userId: profile.id,
                message: `Verification code sent to your ${profile.two_factor_method}`
            });
        }

        // No 2FA required - return success
        return res.json({
            needs2FA: false,
            user: {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role
            }
        });

    } catch (error: any) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
});

/**
 * POST /api/auth/verify-2fa
 * Verify OTP code
 */
router.post('/verify-2fa', async (req: Request, res: Response) => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            return res.status(400).json({ error: 'User ID and verification code are required' });
        }

        // Verify the code
        const result = await AuthService.verifyOTPCode(userId, code);

        if (!result.valid) {
            return res.status(400).json({ error: result.error });
        }

        // Get user profile
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                account_type: true
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            success: true,
            user: profile
        });

    } catch (error: any) {
        console.error('❌ 2FA verification error:', error);
        res.status(500).json({
            error: '2FA verification failed',
            details: error.message
        });
    }
});

/**
 * POST /api/auth/resend-2fa-code
 * Resend OTP code
 */
router.post('/resend-2fa-code', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Get user profile
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                two_factor_method: true,
                phone: true
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate and store new code
        const code = AuthService.generateOTP();
        await AuthService.storeOTPCode(profile.id, code);

        // Send code
        if (profile.two_factor_method === 'phone' && profile.phone) {
            const result = await AuthService.sendOTPSMS(profile.phone, code);
            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }
        } else {
            const result = await AuthService.sendOTPEmail(profile.email, code);
            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }
        }

        return res.json({
            success: true,
            message: `New verification code sent to your ${profile.two_factor_method}`
        });

    } catch (error: any) {
        console.error('❌ Resend code error:', error);
        res.status(500).json({
            error: 'Failed to resend code',
            details: error.message
        });
    }
});

export default router;
