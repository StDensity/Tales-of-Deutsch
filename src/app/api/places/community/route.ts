import { NextResponse } from "next/server";
import { getPlacesByCommunityStatus } from "@/services/placeService";

export async function GET() {
  try {
    // Use the service function to get community places
    const communityPlaces = await getPlacesByCommunityStatus(true);
    
    return NextResponse.json(communityPlaces);
  } catch (error) {
    console.error("Error fetching community places:", error);
    return NextResponse.json(
      { error: "Failed to fetch community places" },
      { status: 500 }
    );
  }
}