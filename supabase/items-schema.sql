-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit TEXT,
    expiry_date DATE,
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
-- Create index on expiry_date for expiry queries
CREATE INDEX IF NOT EXISTS idx_items_expiry_date ON items(expiry_date);
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