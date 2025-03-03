import { NextResponse } from "next/server";
import { getStoriesByCommunityStatus } from "@/services/storyService";

export async function GET() {
  try {
    // Use the service function to get community stories
    const communityStories = await getStoriesByCommunityStatus(true);
    
    return NextResponse.json(communityStories);
  } catch (error) {
    console.error("Error fetching community stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch community stories" },
      { status: 500 }
    );
  }
}