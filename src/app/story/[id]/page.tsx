"use client";

import { useState, use } from "react";
import Link from "next/link";
import ClickableText from "@/components/ClickableText";
import StoryMenu from "@/components/StoryMenu";
import { usePostHog } from "posthog-js/react";
import { Paragraph, Story } from "@/types/story";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

// API fetch functions
const fetchStory = async (id: string) => {
  const response = await fetch(`/api/stories/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch story");
  }
  return response.json();
};

const fetchAuthorName = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }
  const data = await response.json();
  return data.fullName || data.username || "Anonymous";
};

const fetchCategory = async (storyId: number) => {
  const response = await fetch(`/api/stories/${storyId}/category`);
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  const data = await response.json();
  return data.categories && data.categories.length > 0 
    ? data.categories[0].name 
    : "";
};

// Add function to check if user is the author
const checkIsAuthor = async (storyId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/stories/${storyId}/is-author`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.isAuthor;
  } catch (error) {
    console.error("Error checking if user is author:", error);
    return false;
  }
};

export default function StoryPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const {id} = use(params)
   const [visibleTranslations, setVisibleTranslations] = useState<number[]>([]);
   const posthog = usePostHog();
   const { isSignedIn } = useUser();

   // Fetch story data with React Query
   const { data: story, isLoading: storyLoading, error: storyError } = useQuery({
     queryKey: ['story', id],
     queryFn: () => fetchStory(id),
   });

   // Fetch author data with React Query (only if story has userId)
   const { data: authorName = "Unknown Author" } = useQuery({
     queryKey: ['author', story?.userId],
     queryFn: () => fetchAuthorName(story?.userId as string),
     enabled: !!story?.userId, // Only run query if userId exists
   });

   // Fetch category data with React Query
   const { data: category = "" } = useQuery({
     queryKey: ['category', story?.id],
     queryFn: () => fetchCategory(story?.id as number),
     enabled: !!story?.id, // Only run query if story id exists
   });

   // Add query to check if user is the author
   const { data: isAuthor = false } = useQuery({
     queryKey: ['isAuthor', story?.id],
     queryFn: () => checkIsAuthor(story?.id as number),
     enabled: !!story?.id && isSignedIn, // Only run if story exists and user is signed in
   });

   const toggleTranslation = (index: number) => {
      if (!story) return;
      
      const isShowing = !visibleTranslations.includes(index);

      // Track translation toggle event
      posthog?.capture("translation_toggled", {
         story_id: story.id,
         story_title: story.title,
         paragraph_index: index,
         action: isShowing ? "show" : "hide",
      });

      setVisibleTranslations((prev) =>
         prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
      );
   };

   if (storyLoading) {
      return (
         <main className="min-h-screen p-8 pb-16">
            <div className="max-w-3xl mx-auto text-center py-12">
               <p>Loading story...</p>
            </div>
         </main>
      );
   }

   if (storyError || !story) {
      return (
         <main className="min-h-screen p-8 pb-16">
            <Link
               href="/stories"
               className="inline-block mb-8 text-accent hover:underline"
            >
               ← Back to Stories
            </Link>
            <div className="max-w-3xl mx-auto text-center py-12">
               <p className="text-lg text-red-500">
                 {storyError instanceof Error ? storyError.message : "Story not found"}
               </p>
            </div>
         </main>
      );
   }
   
   // Format the creation date
   const createdDate = story.createdAt 
      ? new Date(story.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Unknown date';

   return (
      <main className="min-h-screen p-8 pb-16">
         <Link
            href="/stories"
            className="inline-block mb-8 text-accent hover:underline"
         >
            ← Back to Stories
         </Link>

         <article className="max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-4">
               <h1 className="text-4xl font-semibold">{story.title}</h1>
               <StoryMenu storyId={story.id} isAuthor={isAuthor} />
            </div>
            
            {/* Story metadata section - improved styling */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
               <div className="bg-accent/20 text-accent px-4 py-2 rounded-md font-medium">
                  Level: {story.level}
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <span className="text-text-secondary">{createdDate}</span>
                  </div>
                  {authorName && (
                     <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-text-secondary">{authorName}</span>
                     </div>
                  )}
                  {category && (
                     <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-text-secondary">{category}</span>
                     </div>
                  )}
               </div>
            </div>

            <div className="space-y-8">
               {story.content.map((paragraph: Paragraph, index: number) => (
                  <div key={index} className="bg-card-bg rounded-lg p-6">
                     <ClickableText
                        text={paragraph.german}
                        className="text-lg mb-4"
                     />

                     <button
                        onClick={() => toggleTranslation(index)}
                        className="text-accent hover:text-accent/80 transition-colors"
                     >
                        {visibleTranslations.includes(index) ? "Hide" : "Show"}{" "}
                        Translation
                     </button>

                     <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                           visibleTranslations.includes(index)
                              ? "max-h-[500px] opacity-100 mt-4"
                              : "max-h-0 opacity-0"
                        }`}
                     >
                        <p className="text-text-secondary italic">
                           {paragraph.english}
                        </p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Updated AI-generated content notification */}
            <div className="mt-12 mb-4 text-center">
               <p className="text-xs text-text-secondary italic">
                  Stories and translations are generated by LLMs
               </p>
            </div>
         </article>
      </main>
   );
}
