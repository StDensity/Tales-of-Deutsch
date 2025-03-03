import { NextResponse } from "next/server";
import { getAllStories } from "@/services/storyService";

export async function GET() {
  try {
    const stories = await getAllStories();
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}