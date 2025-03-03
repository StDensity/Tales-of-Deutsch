import { NextResponse } from "next/server";
import { getStoriesByCommunityStatus } from "@/services/storyService";

export async function GET() {
  try {
    const allStories = await getStoriesByCommunityStatus(false);
    const featuredStories = allStories.slice(0, 2); // Get first 2 stories
    
    return NextResponse.json(featuredStories);
  } catch (error) {
    console.error("Error fetching featured stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured stories" },
      { status: 500 }
    );
  }
}