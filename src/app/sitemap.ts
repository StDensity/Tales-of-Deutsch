import { dummyStories } from "@/data/dummyStories";
import { getAllStories } from "@/services/storyService";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tales-of-deutsch.vercel.app";
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
  
  // Dynamic story routes from database
  const stories = await getAllStories();
  const storyRoutes = stories.map((story) => ({
    url: `${baseUrl}/story/${story.id}`,
    // lastModified: new Date(story.updatedAt || story.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  
  return [...staticRoutes, ...storyRoutes];
}