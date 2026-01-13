import prisma from '../lib/prisma.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export class AuthService {
    private static transporter: nodemailer.Transporter | null = null;

    private static getTransporter() {
        if (!this.transporter && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: 587, // Force 587 for STARTTLS (best for Render)
                secure: false, // Must be false for port 587
                requireTLS: true, // Force TLS
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    ciphers: 'SSLv3' // Compatibility setting
                },
                // Robustness & Logging
                connectionTimeout: 20000,
                greetingTimeout: 20000,
                family: 4,     // Force IPv4
                logger: true,  // Log SMTP traffic to console
                debug: true    // Include debug info in logs
            } as any);
        }
        return this.transporter;
    }

    /**
     * Verify SMTP Connection (Call on server startup)
     */
    static async verifySMTPConnection(): Promise<boolean> {
        const transporter = this.getTransporter();
        if (!transporter) {
            console.warn('⚠️ SMTP Transporter not initialized (Missing credentials)');
            return false;
        }
        try {
            await transporter.verify();
            console.log('✅ SMTP Connection Verified Successfully');
            return true;
        } catch (error) {
            console.error('❌ SMTP Connection Verification Failed:', error);
            return false;
        }
    }
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

            // Development Logging
            if (process.env.NODE_ENV === 'development') {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`🔐 2FA CODE FOR ${email}: ${code}`);
                console.log(`${'='.repeat(50)}\n`);
            }

            // Production: Send Real Email
            const transporter = this.getTransporter();
            if (transporter) {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || '"Family Assets Support" <noreply@familyassets.com>',
                    to: email,
                    subject: '🔐 Your 2FA Verification Code',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Verification Required</h2>
                            <p>Here is your One-Time Password (OTP) to verify your identity:</p>
                            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                                <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${code}</h1>
                            </div>
                            <p>This code will expire in 10 minutes.</p>
                            <p>If you didn't request this code, please ignore this email.</p>
                        </div>
                    `,
                });
                console.log('✅ Email sent successfully via SMTP');
            } else {
                console.warn('⚠️ SMTP credentials missing or invalid. OTP email NOT sent.');
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending OTP email:', error);
            // Don't leak exact error to client, but log it
            return { success: false, error: 'Failed to send verification code' };
        }
    }

    /**
     * Send OTP code via SMS (future implementation with Twilio)
     */
    static async sendOTPSMS(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log(`📱 Sending OTP ${code} to ${phone}`);

            // Development Logging
            if (process.env.NODE_ENV === 'development') {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`🔐 2FA CODE FOR ${phone}: ${code}`);
                console.log(`${'='.repeat(50)}\n`);
            }

            // Production: Send Real SMS via Twilio
            if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

                await client.messages.create({
                    body: `Your Family Assets verification code is: ${code}. Valid for 10 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phone
                });
                console.log('✅ SMS sent successfully via Twilio');
            } else {
                console.warn('⚠️ Twilio credentials missing. OTP SMS NOT sent (check server logs/console).');
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending OTP SMS:', error);
            return { success: false, error: 'Failed to send verification code via SMS' };
        }
    }
}
