// SERVER SIDE ONLY - Do not import in client components
// This service should only be used in API routes or server components
import { db } from "@/db";
import { stories, paragraphs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Story } from "@/types/story";

export async function getAllStories(): Promise<Story[]> {
  try {
    // Fetch all stories
    const allStories = await db.query.stories.findMany({
      orderBy: (stories, { desc }) => [desc(stories.createdAt)],
    });

    // Fetch paragraphs for each story
    const storiesWithContent = await Promise.all(
      allStories.map(async (story) => {
        const storyParagraphs = await db.query.paragraphs.findMany({
          where: eq(paragraphs.storyId, story.id),
          orderBy: (paragraphs, { asc }) => [asc(paragraphs.paragraphOrder)],
        });

        return {
          ...story,
          content: storyParagraphs,
        };
      })
    );

    return storiesWithContent;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}

export async function getStoryById(id: number): Promise<Story | null> {
  try {
    // Fetch the story
    const story = await db.query.stories.findFirst({
      where: eq(stories.id, id),
    });

    if (!story) {
      return null;
    }

    // Fetch paragraphs for the story
    const storyParagraphs = await db.query.paragraphs.findMany({
      where: eq(paragraphs.storyId, story.id),
      orderBy: (paragraphs, { asc }) => [asc(paragraphs.paragraphOrder)],
    });

    return {
      ...story,
      content: storyParagraphs,
    };
  } catch (error) {
    console.error(`Error fetching story with id ${id}:`, error);
    return null;
  }
}

// New function to get stories based on community status
export async function getStoriesByCommunityStatus(includeCommunity: boolean): Promise<Story[]> {
  try {
    // Fetch stories with the specified community status
    const filteredStories = await db.query.stories.findMany({
      where: eq(stories.isCommunity, includeCommunity),
      with: {
        paragraphs: {
          orderBy: (paragraphs, { asc }) => [asc(paragraphs.paragraphOrder)],
        },
      },
      orderBy: (stories, { desc }) => [desc(stories.createdAt)],
    });

    // Format the response
    const formattedStories = filteredStories.map(story => ({
      ...story,
      content: story.paragraphs,
      paragraphs: undefined, // Remove the paragraphs property
    }));

    return formattedStories;
  } catch (error) {
    console.error(`Error fetching stories with community status ${includeCommunity}:`, error);
    return [];
  }
}