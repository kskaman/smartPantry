import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

// Sample items with variety of expiry dates and appropriate units
const generateSeedItems = () => {
  const allItems = [
    "Milk",
    "Eggs",
    "Bread",
    "Cheese",
    "Yogurt",
    "Butter",
    "Chicken Breast",
    "Ground Beef",
    "Salmon",
    "Shrimp",
    "Lettuce",
    "Tomatoes",
    "Carrots",
    "Broccoli",
    "Spinach",
    "Bell Peppers",
    "Onions",
    "Garlic",
    "Potatoes",
    "Bananas",
    "Apples",
    "Oranges",
    "Strawberries",
    "Blueberries",
    "Grapes",
    "Rice",
    "Pasta",
    "Canned Beans",
    "Canned Tomatoes",
    "Olive Oil",
    "Soy Sauce",
    "Honey",
    "Peanut Butter",
    "Jam",
    "Cereal",
    "Oatmeal",
    "Coffee",
    "Tea",
    "Orange Juice",
    "Soda",
    "Mineral Water",
    "Ice Cream",
    "Frozen Pizza",
    "Bacon",
    "Sausages",
    "Ham",
    "Turkey Slices",
    "Mozzarella",
    "Cheddar Cheese",
    "Greek Yogurt",
    "Almond Milk",
    "Whole Wheat Bread",
    "Sourdough Bread",
    "Brown Rice",
    "Quinoa",
    "Lentils",
    "Chickpeas",
    "Black Beans",
    "Kidney Beans",
    "Pinto Beans",
    "Green Beans",
    "Peas",
    "Corn",
    "Mushrooms",
    "Zucchini",
    "Eggplant",
    "Cucumber",
    "Celery",
    "Cauliflower",
    "Cabbage",
    "Kale",
    "Asparagus",
    "Green Onions",
    "Lemons",
    "Limes",
    "Avocados",
    "Mangoes",
    "Pineapple",
    "Watermelon",
    "Cantaloupe",
    "Peaches",
    "Plums",
    "Cherries",
    "Raspberries",
    "Blackberries",
    "Kiwi",
    "Pears",
    "Grapefruit",
    "Papaya",
    "Coconut Milk",
    "Heavy Cream",
    "Sour Cream",
    "Cream Cheese",
    "Parmesan Cheese",
    "Feta Cheese",
    "Goat Cheese",
    "Blue Cheese",
    "Swiss Cheese",
    "Provolone",
    "Ground Turkey",
    "Ground Pork",
    "Pork Chops",
    "Beef Steak",
    "Lamb Chops",
    "Tuna",
    "Cod",
    "Tilapia",
    "Crab Meat",
    "Lobster",
    "Scallops",
    "Tofu",
    "Tempeh",
    "Hummus",
    "Salsa",
    "Guacamole",
    "Ketchup",
    "Mustard",
    "Mayonnaise",
    "BBQ Sauce",
    "Hot Sauce",
    "Worcestershire Sauce",
    "Teriyaki Sauce",
    "Balsamic Vinegar",
    "Apple Cider Vinegar",
    "White Vinegar",
    "Vegetable Oil",
    "Coconut Oil",
    "Sesame Oil",
    "Peanut Oil",
    "Flour",
    "Sugar",
    "Brown Sugar",
    "Powdered Sugar",
    "Salt",
    "Black Pepper",
    "Paprika",
    "Cumin",
    "Oregano",
    "Basil",
    "Thyme",
    "Rosemary",
    "Cinnamon",
    "Nutmeg",
    "Vanilla Extract",
    "Baking Powder",
    "Baking Soda",
    "Yeast",
    "Cornstarch",
    "Cocoa Powder",
    "Chocolate Chips",
    "Peanuts",
    "Almonds",
    "Cashews",
    "Walnuts",
    "Pistachios",
    "Raisins",
    "Dried Cranberries",
    "Dried Apricots",
    "Prunes",
    "Maple Syrup",
    "Agave Nectar",
    "Molasses",
  ];

  // Generate enough items to test pagination (100+ items)
  const desiredCount = 120;
  const items: string[] =
    allItems.length >= desiredCount
      ? allItems.slice(0, desiredCount)
      : (() => {
          const out = [...allItems];
          let i = 0;
          while (out.length < desiredCount) {
            out.push(allItems[i % allItems.length]);
            i++;
          }
          return out;
        })();

  // Map some common items to sensible units (using your defined units)
  // Allowed units: pieces, grams, kilograms, milligrams, milliliters, litres, ounces, pound, cup, tbsp, tsp
  const unitMap: Record<string, string | null> = {
    Milk: "litres",
    "Almond Milk": "litres",
    "Coconut Milk": "litres",
    "Orange Juice": "litres",
    "Olive Oil": "litres",
    "Vegetable Oil": "litres",
    "Coconut Oil": "litres",
    "Sesame Oil": "litres",
    "Peanut Oil": "litres",
    "Mineral Water": "litres",
    Soda: "litres",
    Coffee: "grams",
    Tea: "grams",
    "Cocoa Powder": "grams",
    Rice: "kilograms",
    "Brown Rice": "kilograms",
    Quinoa: "kilograms",
    Pasta: "kilograms",
    Flour: "kilograms",
    Sugar: "kilograms",
    "Brown Sugar": "kilograms",
    Salt: "kilograms",
    "Ground Beef": "kilograms",
    "Ground Turkey": "kilograms",
    "Ground Pork": "kilograms",
    "Chicken Breast": "kilograms",
    "Pork Chops": "kilograms",
    "Beef Steak": "kilograms",
    "Lamb Chops": "kilograms",
    Bacon: "grams",
    Sausages: "kilograms",
    Ham: "kilograms",
    "Turkey Slices": "grams",
    Salmon: "kilograms",
    Tuna: "kilograms",
    Cod: "kilograms",
    Tilapia: "kilograms",
    Shrimp: "kilograms",
    "Crab Meat": "grams",
    Lobster: "kilograms",
    Scallops: "grams",
    Cheese: "kilograms",
    Mozzarella: "grams",
    "Cheddar Cheese": "grams",
    Parmesan: "grams",
    "Feta Cheese": "grams",
    "Goat Cheese": "grams",
    "Blue Cheese": "grams",
    "Swiss Cheese": "grams",
    Provolone: "grams",
    Yogurt: "pieces",
    "Greek Yogurt": "pieces",
    Eggs: "pieces",
    Bread: "pieces",
    "Whole Wheat Bread": "pieces",
    "Sourdough Bread": "pieces",
    Butter: "grams",
    "Heavy Cream": "milliliters",
    "Sour Cream": "grams",
    "Cream Cheese": "grams",
    "Peanut Butter": "grams",
    Honey: "grams",
    "Maple Syrup": "milliliters",
    Jam: "grams",
    Cereal: "pieces",
    Oatmeal: "grams",
    "Canned Beans": "pieces",
    "Canned Tomatoes": "pieces",
    "Frozen Pizza": "pieces",
    "Ice Cream": "pieces",
    Tomatoes: "pieces",
    Lettuce: "pieces",
    Carrots: "kilograms",
    Broccoli: "pieces",
    Spinach: "grams",
    Kale: "grams",
    "Bell Peppers": "pieces",
    Onions: "kilograms",
    "Green Onions": "pieces",
    Garlic: "pieces",
    Potatoes: "kilograms",
    Mushrooms: "grams",
    Zucchini: "pieces",
    Eggplant: "pieces",
    Cucumber: "pieces",
    Celery: "pieces",
    Cauliflower: "pieces",
    Cabbage: "pieces",
    Asparagus: "grams",
    Corn: "pieces",
    Peas: "grams",
    "Green Beans": "grams",
    Lentils: "kilograms",
    Chickpeas: "kilograms",
    "Black Beans": "kilograms",
    "Kidney Beans": "kilograms",
    "Pinto Beans": "kilograms",
    Bananas: "pieces",
    Apples: "pieces",
    Oranges: "pieces",
    Lemons: "pieces",
    Limes: "pieces",
    Strawberries: "grams",
    Blueberries: "grams",
    Raspberries: "grams",
    Blackberries: "grams",
    Grapes: "grams",
    Avocados: "pieces",
    Mangoes: "pieces",
    Pineapple: "pieces",
    Watermelon: "pieces",
    Cantaloupe: "pieces",
    Peaches: "pieces",
    Plums: "pieces",
    Cherries: "grams",
    Kiwi: "pieces",
    Pears: "pieces",
    Grapefruit: "pieces",
    Papaya: "pieces",
    Tofu: "grams",
    Tempeh: "grams",
    Hummus: "grams",
    Salsa: "grams",
    Guacamole: "grams",
    Ketchup: "milliliters",
    Mustard: "milliliters",
    Mayonnaise: "milliliters",
    "BBQ Sauce": "milliliters",
    "Hot Sauce": "milliliters",
    "Soy Sauce": "milliliters",
    "Worcestershire Sauce": "milliliters",
    "Teriyaki Sauce": "milliliters",
    "Balsamic Vinegar": "milliliters",
    "Apple Cider Vinegar": "milliliters",
    "White Vinegar": "milliliters",
    Peanuts: "grams",
    Almonds: "grams",
    Cashews: "grams",
    Walnuts: "grams",
    Pistachios: "grams",
    Raisins: "grams",
    "Dried Cranberries": "grams",
    "Dried Apricots": "grams",
    Prunes: "grams",
    "Chocolate Chips": "grams",
    "Vanilla Extract": "milliliters",
    "Baking Powder": "grams",
    "Baking Soda": "grams",
    Yeast: "grams",
    Cornstarch: "grams",
    "Powdered Sugar": "grams",
    "Black Pepper": "grams",
    Paprika: "grams",
    Cumin: "grams",
    Oregano: "grams",
    Basil: "grams",
    Thyme: "grams",
    Rosemary: "grams",
    Cinnamon: "grams",
    Nutmeg: "grams",
    "Agave Nectar": "milliliters",
    Molasses: "milliliters",
  };

  const now = new Date();

  return items.map((name, index) => {
    // Spread expiry dates around today: some past, some soon, some future
    const half = Math.floor(desiredCount / 2);
    const daysOffset = (index - half) * 2; // e.g., -46 .. +48 roughly
    const expiryDate = new Date(now);
    expiryDate.setDate(now.getDate() + daysOffset);

    // choose unit and quantity logic - using your actual unit names
    const unit =
      unitMap[name] ??
      (/water|juice|oil|soda|milk|cream/i.test(name)
        ? "litres"
        : /rice|pasta|beef|chicken|salmon|shrimp|bacon|sausage|ham|turkey|flour|sugar|beans|lentils/i.test(
              name,
            )
          ? "kilograms"
          : /coffee|tea|honey|peanut|spice|herb|nut|chocolate/i.test(name)
            ? "grams"
            : "pieces");

    // sensible quantities based on unit
    let quantity = 1;
    if (unit === "kilograms")
      quantity = Math.floor(Math.random() * 3) + 1; // 1-3 kg
    else if (unit === "grams")
      quantity = Math.floor(Math.random() * 500) + 100; // 100-600 g
    else if (unit === "litres")
      quantity = Math.floor(Math.random() * 3) + 1; // 1-3 l
    else if (unit === "milliliters")
      quantity = Math.floor(Math.random() * 900) + 100; // 100-1000 ml
    else if (unit === "milligrams")
      quantity = Math.floor(Math.random() * 500) + 1; // 1-500 mg
    else if (unit === "ounces" || unit === "pound")
      quantity = Math.floor(Math.random() * 16) + 1;
    else if (unit === "cup" || unit === "tbsp" || unit === "tsp")
      quantity = Math.floor(Math.random() * 8) + 1;
    else quantity = Math.floor(Math.random() * 12) + 1; // pieces default 1-12

    return {
      name,
      quantity,
      unit: unit,
      expiry_date: expiryDate.toISOString(),
    };
  });
};

export async function POST() {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();

    // Generate 120 seed items for pagination testing
    const seedItems = generateSeedItems();

    // Add user_id to all items
    const itemsWithUser = seedItems.map((item) => ({
      ...item,
      user_id: user.id,
    }));

    // Insert all items at once
    const { data, error } = await supabase
      .from("items")
      .insert(itemsWithUser)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to seed items", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Successfully seeded database",
      count: data?.length || 0,
      items: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
