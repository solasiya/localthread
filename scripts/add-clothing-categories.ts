import { db } from "../server/db";
import { categories } from "../shared/schema";
import { generateSlug } from "../client/src/lib/utils";

// Define clothing categories
const clothingCategories = [
  {
    name: "T-shirts",
    description: "Casual short-sleeved shirts perfect for everyday wear"
  },
  {
    name: "Shirts",
    description: "Formal and casual button-up shirts for men and women"
  },
  {
    name: "Hoodies",
    description: "Comfortable hooded sweatshirts for casual and sporty occasions"
  },
  {
    name: "Caps",
    description: "Stylish headwear for sun protection and fashion"
  },
  {
    name: "Beanies",
    description: "Warm knitted hats for cold weather"
  },
  {
    name: "Winter Sweaters",
    description: "Warm and cozy sweaters for the cold season"
  },
  {
    name: "Jackets",
    description: "Outer garments for protection against cold weather"
  }
];

async function addClothingCategories() {
  try {
    console.log("Adding clothing categories...");
    
    for (const category of clothingCategories) {
      const slug = generateSlug(category.name);
      
      // Check if category already exists
      const existingCategory = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.slug, slug)
      });
      
      if (!existingCategory) {
        await db.insert(categories).values({
          name: category.name,
          slug: slug,
          description: category.description
        });
        console.log(`Added category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }
    
    console.log("All clothing categories added successfully!");
  } catch (error) {
    console.error("Error adding clothing categories:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
addClothingCategories();