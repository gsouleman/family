-- Run this script in your Neon/Supabase SQL Editor to fix the profiles table

-- 1. Ensure the profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  account_type text DEFAULT 'family',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- 2. Add the missing 'role' and 'status' columns if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- 3. Enable RLS (Optional but recommended)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Add a policy to allow public access (Simplest for now)
DROP POLICY IF EXISTS "Public Value" ON public.profiles;
CREATE POLICY "Public Value" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
