import { NextRequest, NextResponse } from "next/server";
import { getStoryById } from "@/services/storyService";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {

  try {
    let {id} = await params;

    const parsedId = parseInt(id);
    
  
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }

    const story = await getStoryById(parsedId);
    
    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const storyId = parseInt(params.id);
    
    if (isNaN(storyId)) {
      return NextResponse.json(
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }
    
    // First check if the story exists and belongs to the user
    const story = await db.query.stories.findFirst({
      where: eq(stories.id, storyId),
    });
    
    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }
    
    if (story.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this story" },
        { status: 403 }
      );
    }
    
    // Delete the story
    await db.update(stories)
    .set({ sentForDelete: true })
    .where(and(
      eq(stories.id, storyId),
      eq(stories.userId, user.id)
    ));
  
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}