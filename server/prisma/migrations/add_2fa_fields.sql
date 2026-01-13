-- Add 2FA OTP fields to profiles table
-- Run this SQL directly in your Neon database console

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_code_expires TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('two_factor_code', 'two_factor_code_expires', 'last_login');
