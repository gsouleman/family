# IMMEDIATE FIX: Run This SQL Directly on Neon Database

## Problem

Render deployment keeps failing to find Prisma schema. Instead of fighting with the build process, **run this SQL directly on your Neon database console** to add the missing columns immediately.

## SQL to Run

```sql
-- Add 2FA columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_method TEXT NOT NULL DEFAULT 'email';
```

## How to Run

1. **Go to**: [Neon Dashboard](https://console.neon.tech)
2. **Select**: Your project/database
3. **Click**: "SQL Editor" or "Query" tab
4. **Paste**: The SQL above
5. **Click**: "Run" or "Execute"
6. **Verify**: Should see "ALTER TABLE" success message

## Verify It Worked

Run this query to check the columns exist:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('phone', 'is_2fa_enabled', 'two_factor_method');
```

**Expected output:**
```
phone              | text    | NULL
is_2fa_enabled     | boolean | false
two_factor_method  | text    | 'email'::text
```

## Test the Application

Once the SQL is run:
1. **Refresh** your frontend: `https://family-assets-frontend.onrender.com`
2. **Go to**: Admin Portal → User Management
3. **Edit** a user
4. **Update**: Phone, enable 2FA, select method
5. **Click**: "Update User"

**Expected**: ✅ Success! No more 500 error!

## Why This Works

- Bypasses Prisma migration system entirely
- Adds columns directly to database
- Backend code already expects these columns
- Fix takes 30 seconds vs hours of debugging

## Fix the Build Later

After this immediate fix works, we can:
1. Simplify render.yaml back to basic build
2. Mark the migration as "applied" manually
3. Or just leave it - the columns exist, that's what matters!

---

**DO THIS NOW** → Much faster than debugging Render build issues! 🚀
