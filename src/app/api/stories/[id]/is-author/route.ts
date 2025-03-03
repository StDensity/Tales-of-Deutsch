import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ isAuthor: false }, { status: 401 });
    }
    
    const storyId = parseInt(params.id);
    
    if (isNaN(storyId)) {
      return NextResponse.json(
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }
    
    const story = await db.query.stories.findFirst({
      where: eq(stories.id, storyId),
    });
    
    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }
    
    const isAuthor = story.userId === user.id;
    
    return NextResponse.json({ isAuthor });
  } catch (error) {
    console.error("Error checking story author:", error);
    return NextResponse.json(
      { error: "Failed to check story author" },
      { status: 500 }
    );
  }
}