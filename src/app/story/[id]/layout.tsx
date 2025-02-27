import { dummyStories } from "@/data/dummyStories";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params.id is properly handled as a string and awaited
  const {id} = await Promise.resolve(params);
  
  // Find the story by ID
  const story = dummyStories.find(s => s.id === parseInt(id));
  
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