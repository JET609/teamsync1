# Teamsync — AI Employee Directory

## Quick Deploy

### 1. Supabase Setup
Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/kavlulybrhiganzplemg/sql/new) and paste the contents of `supabase/schema.sql`. Click Run.

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your keys:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key from Supabase Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` — service role key from Supabase Settings > API
- `OPENAI_API_KEY` — from platform.openai.com/api-keys

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deploy to Vercel
- Push to GitHub
- Import into Vercel
- Add environment variables in Vercel Settings
- Add your Vercel URL to Supabase Auth > URL Configuration > Redirect URLs

### 5. Make yourself Admin
After signing up, run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your@email.com'
);
```
