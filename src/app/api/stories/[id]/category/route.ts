import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { storyCategories, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params;
      const storyId = parseInt(id);

      if (isNaN(storyId)) {
         return NextResponse.json(
            { error: "Invalid story ID" },
            { status: 400 }
         );
      }

      // Get the categories for this story using a join
      const storyWithCategories = await db
         .select({
            categoryId: storyCategories.categoryId,
            categoryName: categories.name,
         })
         .from(storyCategories)
         .innerJoin(categories, eq(storyCategories.categoryId, categories.id))
         .where(eq(storyCategories.storyId, storyId));

      // Format the response
      const formattedCategories = storyWithCategories.map((item) => ({
         id: item.categoryId,
         name: item.categoryName,
      }));

      return NextResponse.json({
         categories: formattedCategories,
      });
   } catch (error) {
      console.error("Error fetching story categories:", error);
      return NextResponse.json(
         { error: "Failed to fetch story categories" },
         { status: 500 }
      );
   }
}
