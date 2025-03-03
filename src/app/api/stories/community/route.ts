import { NextResponse } from "next/server";
import { db } from "@/db";
import { stories, paragraphs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all stories with isCommunity = true
    const communityStories = await db.query.stories.findMany({
      where: eq(stories.isCommunity, true),
      with: {
        paragraphs: {
          orderBy: (paragraphs, { asc }) => [asc(paragraphs.paragraphOrder)],
        },
      },
      orderBy: (stories, { desc }) => [desc(stories.createdAt)],
    });

    // Format the response
    const formattedStories = communityStories.map(story => ({
      ...story,
      content: story.paragraphs,
      paragraphs: undefined, // Remove the paragraphs property
    }));

    return NextResponse.json(formattedStories);
  } catch (error) {
    console.error("Error fetching community stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch community stories" },
      { status: 500 }
    );
  }
}