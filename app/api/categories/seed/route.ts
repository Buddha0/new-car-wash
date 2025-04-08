import { NextResponse } from "next/server";
import db from "@/lib/db";

// Hardcoded car parts categories to seed the database
const carPartsCategories = [
  { name: "Engine Parts" },
  { name: "Brakes & Suspension" },
  { name: "Electrical Components" },
  { name: "Exterior Accessories" },
  { name: "Interior Accessories" },
  { name: "Lighting & Bulbs" },
  { name: "Filters" },
  { name: "Oils & Fluids" },
  { name: "Tires & Wheels" },
  { name: "Tools & Equipment" },
];

export async function GET() {
  try {
    // Check if categories already exist
    const existingCategories = await db.category.findMany();

    if (existingCategories.length > 0) {
      return NextResponse.json({
        message: "Categories already exist",
        categories: existingCategories,
      });
    }

    // Create categories if none exist
    const createdCategories = [];

    for (const category of carPartsCategories) {
      const createdCategory = await db.category.create({
        data: category,
      });
      createdCategories.push(createdCategory);
    }

    return NextResponse.json({
      message: "Categories created successfully",
      categories: createdCategories,
    });
  } catch (error) {
    console.error("[CATEGORIES_SEED]", error);
    return new NextResponse("Error seeding categories", { status: 500 });
  }
}
