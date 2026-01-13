import prisma from '../lib/prisma.js';
import crypto from 'crypto';

export class AuthService {
    /**
     * Generate a 6-digit OTP code
     */
    static generateOTP(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Store OTP code for a user with 10-minute expiry
     */
    static async storeOTPCode(userId: string, code: string): Promise<void> {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.profile.update({
            where: { id: userId },
            data: {
                two_factor_code: code,
                two_factor_code_expires: expiresAt
            }
        });
    }

    /**
     * Verify OTP code for a user
     */
    static async verifyOTPCode(userId: string, code: string): Promise<{ valid: boolean; error?: string }> {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: {
                two_factor_code: true,
                two_factor_code_expires: true
            }
        });

        if (!profile) {
            return { valid: false, error: 'User not found' };
        }

        if (!profile.two_factor_code || !profile.two_factor_code_expires) {
            return { valid: false, error: 'No verification code found. Please request a new code.' };
        }

        // Check if code expired
        if (new Date() > profile.two_factor_code_expires) {
            return { valid: false, error: 'Verification code has expired. Please request a new code.' };
        }

        // Check if code matches
        if (profile.two_factor_code !== code) {
            return { valid: false, error: 'Invalid verification code' };
        }

        // Clear the code after successful verification
        await prisma.profile.update({
            where: { id: userId },
            data: {
                two_factor_code: null,
                two_factor_code_expires: null,
                last_login: new Date()
            }
        });

        return { valid: true };
    }

    /**
     * Clear expired OTP codes (can be run periodically)
     */
    static async clearExpiredCodes(): Promise<number> {
        const result = await prisma.profile.updateMany({
            where: {
                two_factor_code_expires: {
                    lt: new Date()
                }
            },
            data: {
                two_factor_code: null,
                two_factor_code_expires: null
            }
        });

        return result.count;
    }

    /**
     * Send OTP code via email (using Supabase Auth)
     * In production, you'd integrate with an email service
     */
    static async sendOTPEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log(`📧 Sending OTP ${code} to ${email}`);

            // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
            // For now, we'll log it and rely on Supabase's email for production

            // In development, the code is logged
            if (process.env.NODE_ENV === 'development') {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`🔐 2FA CODE FOR ${email}: ${code}`);
                console.log(`${'='.repeat(50)}\n`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending OTP email:', error);
            return { success: false, error: 'Failed to send verification code' };
        }
    }

    /**
     * Send OTP code via SMS (future implementation with Twilio)
     */
    static async sendOTPSMS(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log(`📱 Sending OTP ${code} to ${phone}`);

            // TODO: Integrate with Twilio or similar SMS service

            if (process.env.NODE_ENV === 'development') {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`🔐 2FA CODE FOR ${phone}: ${code}`);
                console.log(`${'='.repeat(50)}\n`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending OTP SMS:', error);
            return { success: false, error: 'Failed to send verification code via SMS' };
        }
    }
}
