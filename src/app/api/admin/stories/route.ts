import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stories, paragraphs } from "@/db/schema";
import { NewStory, NewParagraph } from "@/types/story";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(); // Get authenticated user
    const adminId = process.env.ADMIN_CLERK_USER_ID;

    // Check if user is authenticated and is admin
    if (!user || user.id !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { title, level, paragraphs: paragraphsData } = body;

    // Validate input
    if (!title || !level || !paragraphsData || !Array.isArray(paragraphsData) || paragraphsData.length === 0) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Insert story into database
    const newStory: NewStory = {
      title,
      level,
      userId: user.id,
    };

    const [insertedStory] = await db.insert(stories).values(newStory).returning();

    if (!insertedStory) {
      return NextResponse.json(
        { error: "Failed to create story" },
        { status: 500 }
      );
    }

    // Insert paragraphs
    const newParagraphs: NewParagraph[] = paragraphsData.map((p: any) => ({
      storyId: insertedStory.id,
      german: p.german,
      english: p.english,
      paragraphOrder: p.paragraphOrder,
    }));

    await db.insert(paragraphs).values(newParagraphs);

    return NextResponse.json({
      success: true,
      storyId: insertedStory.id,
      message: "Story created successfully",
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}