-- Saved Recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  recipe_title TEXT NOT NULL,
  recipe_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  
  -- Prevent duplicate saves
  UNIQUE(user_id, recipe_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_recipe_id ON saved_recipes(recipe_id);

-- Enable Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved recipes
CREATE POLICY "Users can view own saved recipes" ON saved_recipes
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved recipes
CREATE POLICY "Users can insert own saved recipes" ON saved_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved recipes
CREATE POLICY "Users can delete own saved recipes" ON saved_recipes
  FOR DELETE USING (auth.uid() = user_id);
