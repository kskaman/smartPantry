# Supabase Schema Setup

## Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL files in this order:
   - `schema.sql` - Creates the `items` table (required)
   - `recipes-schema.sql` - Creates the `recipes` and `recipe_ingredients` tables (optional, for recipe matching)
   - `settings-schema.sql` - Creates the `user_settings` table (optional, for user preferences)

## Environment Variables

Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### How to Get Your Supabase Credentials

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Select your project** (or create a new one)
3. **Navigate to Settings** → **API** (in the left sidebar)
4. **Copy the following values**:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - This is the key labeled "anon" or "public" (NOT the service_role key)
     - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Important Notes

- The **anon key** is safe to use in client-side code (it's public)
- **Never** use the **service_role key** in client-side code - it bypasses all security
- The anon key works with Row Level Security (RLS) policies to control access
- Since we're using NextAuth, we handle auth in API routes, so RLS is disabled

## Schema Overview

The `items` table stores inventory items with the following fields:

- `id` - UUID primary key
- `user_id` - Text field storing NextAuth user ID
- `name` - Item name (required)
- `quantity` - Decimal quantity (default: 1)
- `unit` - Unit of measurement (optional)
- `location` - One of: 'fridge', 'pantry', 'freezer', 'other' (required)
- `expiry_date` - Expiration date (optional)
- `purchase_date` - Purchase date (optional)
- `category` - Item category (optional)
- `notes` - Additional notes (optional)
- `created_at` - Timestamp (auto)
- `updated_at` - Timestamp (auto-updated)

## Security

Since we're using NextAuth (not Supabase Auth), Row Level Security (RLS) is disabled. Authorization is handled in the API routes (`/app/api/items/route.ts`) which verify the user session before allowing operations.
