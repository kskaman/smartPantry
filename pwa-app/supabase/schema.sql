-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit TEXT,
    location TEXT NOT NULL CHECK (
        location IN ('fridge', 'pantry', 'freezer', 'other')
    ),
    expiry_date DATE,
    purchase_date DATE,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
-- Create index on expiry_date for expiry queries
CREATE INDEX IF NOT EXISTS idx_items_expiry_date ON items(expiry_date);
-- Create index on location for location-based queries
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at BEFORE
UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- Note: Since we're using NextAuth (not Supabase Auth), RLS policies
-- will be enforced at the application level. The policies below are
-- placeholders. In production, you may want to use a service role key
-- for server-side operations and handle authorization in your API routes.
-- For now, we'll allow all operations but enforce user_id matching in API routes
-- In production with Supabase Auth, you would use:
-- CREATE POLICY "Users can view their own items"
--   ON items FOR SELECT
--   USING (auth.uid()::text = user_id);
-- For NextAuth, we'll disable RLS and handle auth in API routes
ALTER TABLE items DISABLE ROW LEVEL SECURITY;