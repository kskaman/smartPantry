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
  ];

  // Ensure exactly 48 items (trim or repeat as needed)
  const desiredCount = 48;
  const items: string[] = allItems.length >= desiredCount ? allItems.slice(0, desiredCount) : (() => {
    const out = [...allItems];
    let i = 0;
    while (out.length < desiredCount) {
      out.push(allItems[i % allItems.length]);
      i++;
    }
    return out;
  })();

  // Map some common items to sensible units (allowed units only)
  // Allowed units: pieces, pcs, g, kg, mg, ml, l, oz, lb, cup, tbsp, tsp
  const unitMap: Record<string, string | null> = {
    Milk: "l",
    "Orange Juice": "l",
    "Olive Oil": "l",
    "Mineral Water": "l",
    Soda: "l",
    Coffee: "g",
    Tea: "g",
    Rice: "kg",
    Pasta: "kg",
    "Ground Beef": "kg",
    "Chicken Breast": "kg",
    Bacon: "g",
    Sausages: "kg",
    Ham: "kg",
    "Turkey Slices": "kg",
    Salmon: "kg",
    Shrimp: "kg",
    Cheese: "kg",
    Mozzarella: "kg",
    Yogurt: "pcs",
    Eggs: "pcs",
    Bread: "pcs",
    Butter: "g",
    "Peanut Butter": "g",
    Honey: "g",
    Jam: "g",
    Cereal: "pcs",
    Oatmeal: "pcs",
    "Canned Beans": "pcs",
    "Canned Tomatoes": "pcs",
    "Frozen Pizza": "pcs",
    "Ice Cream": "pcs",
    Tomatoes: "pcs",
    Lettuce: "pcs",
    Carrots: "kg",
    Broccoli: "pcs",
    Spinach: "pcs",
    "Bell Peppers": "pcs",
    Onions: "kg",
    Garlic: "pcs",
    Potatoes: "kg",
    Bananas: "pcs",
    Apples: "pcs",
    Oranges: "pcs",
    Strawberries: "pcs",
    Blueberries: "pcs",
    Grapes: "pcs",
  };

  const now = new Date();

  return items.map((name, index) => {
    // Spread expiry dates around today: some past, some soon, some future
    const half = Math.floor(desiredCount / 2);
    const daysOffset = (index - half) * 2; // e.g., -46 .. +48 roughly
    const expiryDate = new Date(now);
    expiryDate.setDate(now.getDate() + daysOffset);

    // choose unit and quantity logic - ensure only allowed units
    const unit = unitMap[name] ?? (/[A-Za-z]+\s?(Water|Juice|Oil|Soda|Milk)/i.test(name) ? "l" : /rice|pasta|beef|chicken|salmon|shrimp|bacon|sausage|ham|turkey/i.test(name) ? "kg" : /coffee|tea|honey|peanut|jam/i.test(name) ? "g" : "pcs");

    // sensible quantities based on unit
    let quantity = 1;
    if (unit === "kg") quantity = Math.floor(Math.random() * 3) + 1; // 1-3 kg
    else if (unit === "g") quantity = Math.floor(Math.random() * 500) + 100; // 100-600 g
    else if (unit === "l") quantity = Math.floor(Math.random() * 3) + 1; // 1-3 l
    else if (unit === "ml") quantity = Math.floor(Math.random() * 900) + 100; // 100-1000 ml
    else if (unit === "mg") quantity = Math.floor(Math.random() * 500) + 1; // 1-500 mg
    else if (unit === "oz" || unit === "lb") quantity = Math.floor(Math.random() * 16) + 1;
    else if (unit === "cup" || unit === "tbsp" || unit === "tsp") quantity = Math.floor(Math.random() * 8) + 1;
    else quantity = Math.floor(Math.random() * 12) + 1; // pcs default 1-12

    return {
      name,
      quantity,
      unit: unit,
      expiry_date: expiryDate.toISOString(),
      notes: index % 5 === 0 ? "Test item" : null,
    };
  });
};

export async function POST() {
  try {
    const { user, error: authError } = await getApiUser();
    if (authError) return authError;

    const supabase = await createServerClient();

    // Generate 48 seed items
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
      console.error("Seed error:", error);
      return NextResponse.json(
        { error: "Failed to seed items", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Successfully seeded database",
      count: data?.length || 0,
      items: data,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
