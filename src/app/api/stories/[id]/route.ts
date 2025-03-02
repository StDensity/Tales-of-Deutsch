import { NextRequest, NextResponse } from "next/server";
import { getStoryById } from "@/services/storyService";

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