import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stories, paragraphs, storyCategories } from "@/db/schema";
import { NewStory, NewParagraph } from "@/types/story";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(); // Get authenticated user
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to contribute" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { title, level, categoryIds, paragraphs: paragraphsData } = body;

    // Validate input
    if (!title || !level || !paragraphsData || !Array.isArray(paragraphsData) || paragraphsData.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new story (always set isCommunity to true)
    const newStory: NewStory = {
      title,
      level,
      userId: user.id,
      isCommunity: true, // Always true for community contributions
    };

    // Insert story into database
    const [insertedStory] = await db.insert(stories).values(newStory).returning();

    // Insert paragraphs
    const newParagraphs: NewParagraph[] = paragraphsData.map((p: any, index: number) => ({
      storyId: insertedStory.id,
      german: p.german,
      english: p.english,
      paragraphOrder: p.paragraphOrder || index,
    }));

    await db.insert(paragraphs).values(newParagraphs);

    // Insert category relationships if provided
    if (categoryIds && categoryIds.length > 0) {
      const storyCategoryValues = categoryIds.map((categoryId: number) => ({
        storyId: insertedStory.id,
        categoryId,
      }));

      await db.insert(storyCategories).values(storyCategoryValues);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Story submitted successfully",
      storyId: insertedStory.id 
    });
  } catch (error) {
    console.error("Error adding community story:", error);
    return NextResponse.json(
      { error: "Failed to add story" },
      { status: 500 }
    );
  }
}