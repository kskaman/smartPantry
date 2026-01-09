/**
 * Seed Script - Add 48 test items to database
 * 
 * Usage:
 * 1. Make sure you're logged in to the app
 * 2. Run: node scripts/seed-items.mjs
 * 
 * Or simply call the API endpoint:
 * POST http://localhost:3000/api/items/seed
 */

async function seedItems() {
  try {
    console.log('🌱 Seeding database with test items...\n');

    const response = await fetch('http://localhost:3000/api/items/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to seed items');
    }

    const result = await response.json();
    
    console.log('✅ Success!');
    console.log(`📦 Added ${result.count} items to your inventory\n`);
    console.log('Items include a mix of:');
    console.log('  - Expired items (past expiry dates)');
    console.log('  - Expiring soon items (next 2 days)');
    console.log('  - Fresh items (future expiry dates)');
    console.log('\n🔍 Check your inventory to see pagination in action!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('  1. Your dev server is running (npm run dev)');
    console.error('  2. You are logged in to the application');
    console.error('  3. The database is accessible');
    process.exit(1);
  }
}

seedItems();
