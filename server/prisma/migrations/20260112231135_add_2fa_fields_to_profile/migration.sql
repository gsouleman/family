-- Add 2FA fields to profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "two_factor_method" TEXT NOT NULL DEFAULT 'email';
