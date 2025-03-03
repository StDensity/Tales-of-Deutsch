import { NextResponse } from "next/server";
import {  getStoriesByCommunityStatus } from "@/services/storyService";

export async function GET() {
  try {
    const stories = await getStoriesByCommunityStatus(false);
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}