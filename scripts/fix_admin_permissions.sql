-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Policy for Admins to SEE ALL profiles
-- Allow select if the requesting user's metadata has role='admin' OR their profile has role='admin'
-- Note: Policy logic can be tricky. Simplest is to check the JWT claims.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Policy for Users to update their OWN profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 3. Policy for Users to view their OWN profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 4. Policy for Admins to UPDATE/DELETE any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE
TO authenticated 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile" 
ON public.profiles FOR DELETE
TO authenticated 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- 5. Public Insert (for Sign Up trigger, though normally Supabase handles this via triggers)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
-- (Depending on your privacy needs, you might not want this)
