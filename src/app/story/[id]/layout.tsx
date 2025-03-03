import { dummyStories } from "@/data/dummyStories";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

// Function to fetch story for metadata
async function fetchStoryForMetadata(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${id}`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching story for metadata:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params.id is properly handled as a string and awaited
  const { id } = await Promise.resolve(params);
  
  // Fetch the story from the API
  const story = await fetchStoryForMetadata(id);
  
  // If story not found, return default metadata
  if (!story) {
    return {
      title: "Story Not Found | Tales of Deutsch",
      description: "The requested story could not be found.",
    };
  }

  // Get first paragraph for description (truncate if needed)
  const description = story.content[0]?.english || "";
  const truncatedDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  return {
    title: `${story.title} | Tales of Deutsch`,
    description: truncatedDescription,
    openGraph: {
      title: `${story.title} | Tales of Deutsch`,
      description: truncatedDescription,
      url: `/story/${id}`,
      siteName: "Tales of Deutsch",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: "/images/tales-of-deutsch.png",
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} | Tales of Deutsch`,
      description: truncatedDescription,
      images: ["/images/tales-of-deutsch.png"],
    },
  };
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}