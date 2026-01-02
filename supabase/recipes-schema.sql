-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity DECIMAL(10, 2),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_name ON recipe_ingredients(ingredient_name);

-- Create updated_at trigger for recipes
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample recipes
INSERT INTO recipes (name, description, instructions, prep_time, cook_time, servings, difficulty) VALUES
('Chicken Stir Fry', 'Quick and healthy chicken stir fry with vegetables', '1. Heat oil in a pan\n2. Cook chicken until golden\n3. Add vegetables and stir fry\n4. Season and serve', 15, 20, 4, 'easy'),
('Pasta with Tomato Sauce', 'Classic Italian pasta dish', '1. Boil pasta\n2. Make tomato sauce\n3. Combine and serve', 10, 15, 2, 'easy'),
('Salad Bowl', 'Fresh mixed salad', '1. Wash and chop vegetables\n2. Mix in a bowl\n3. Add dressing', 10, 0, 1, 'easy'),
('Beef Stew', 'Hearty beef stew with vegetables', '1. Brown beef\n2. Add vegetables and broth\n3. Simmer for 1 hour', 20, 60, 6, 'medium'),
('Grilled Salmon', 'Simple grilled salmon with herbs', '1. Season salmon\n2. Grill for 10 minutes\n3. Serve with lemon', 5, 10, 2, 'easy')
ON CONFLICT DO NOTHING;

-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit)
SELECT r.id, 'Chicken', 500, 'g' FROM recipes r WHERE r.name = 'Chicken Stir Fry'
UNION ALL
SELECT r.id, 'Bell Pepper', 2, 'pieces' FROM recipes r WHERE r.name = 'Chicken Stir Fry'
UNION ALL
SELECT r.id, 'Onion', 1, 'piece' FROM recipes r WHERE r.name = 'Chicken Stir Fry'
UNION ALL
SELECT r.id, 'Pasta', 200, 'g' FROM recipes r WHERE r.name = 'Pasta with Tomato Sauce'
UNION ALL
SELECT r.id, 'Tomato', 3, 'pieces' FROM recipes r WHERE r.name = 'Pasta with Tomato Sauce'
UNION ALL
SELECT r.id, 'Lettuce', 200, 'g' FROM recipes r WHERE r.name = 'Salad Bowl'
UNION ALL
SELECT r.id, 'Tomato', 2, 'pieces' FROM recipes r WHERE r.name = 'Salad Bowl'
UNION ALL
SELECT r.id, 'Cucumber', 1, 'piece' FROM recipes r WHERE r.name = 'Salad Bowl'
UNION ALL
SELECT r.id, 'Beef', 500, 'g' FROM recipes r WHERE r.name = 'Beef Stew'
UNION ALL
SELECT r.id, 'Carrot', 3, 'pieces' FROM recipes r WHERE r.name = 'Beef Stew'
UNION ALL
SELECT r.id, 'Potato', 2, 'pieces' FROM recipes r WHERE r.name = 'Beef Stew'
UNION ALL
SELECT r.id, 'Salmon', 300, 'g' FROM recipes r WHERE r.name = 'Grilled Salmon'
ON CONFLICT DO NOTHING;

