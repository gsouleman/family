# Push 2FA System to GitHub - Command Reference

## Open Git Bash or Command Prompt (NOT PowerShell)

Navigate to your project:
```bash
cd c:\CAM\campost\family-assets-sharing
```

## Check what's changed:
```bash
git status
```

## Stage all changes:
```bash
git add -A
```

## Commit with message:
```bash
git commit -m "feat: complete 2FA login system with OTP verification and error handling"
```

## Push to GitHub:
```bash
git push origin main
```

(If your default branch is `master` instead of `main`, use `git push origin master`)

---

## What's Being Pushed

### New Files (10):
- `server/src/services/auth.service.ts` - OTP generation/verification
- `server/src/routes/auth.routes.ts` - Auth API endpoints  
- `server/prisma/migrations/add_2fa_fields.sql` - Database migration
- `src/pages/Login.tsx` - New login page
- `src/pages/Register.tsx` - Registration page
- `src/components/ui/ErrorBanner.tsx` - Error display component
- `src/vite-env.d.ts` - Vite TypeScript definitions
- `DEPLOYMENT_2FA.md` - Deployment instructions

### Modified Files (5):
- `server/prisma/schema.prisma` - Added 2FA OTP fields
- `server/src/controllers/user.controller.ts` - Fixed validation errors
- `server/src/index.ts` - Registered auth routes
- `src/contexts/AuthContext.tsx` - Backend API integration
- `src/App.tsx` - Added Login/Register routes

---

## After Pushing

Once pushed to GitHub, you can deploy to Render. The changes will automatically trigger a deployment if you have auto-deploy enabled, or you can manually deploy from the Render dashboard.

**Important**: Remember to run the database migration SQL on Neon first (from `add_2fa_fields.sql`).
