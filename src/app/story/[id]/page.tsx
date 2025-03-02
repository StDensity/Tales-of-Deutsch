"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ClickableText from "@/components/ClickableText";
import { usePostHog } from "posthog-js/react";
import { Story } from "@/types/story";

export default function StoryPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const {id} = use(params)
   const [story, setStory] = useState<Story | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [authorName, setAuthorName] = useState<string>("");
   const [visibleTranslations, setVisibleTranslations] = useState<number[]>([]);
   const posthog = usePostHog();

   // Fetch story from the database
   useEffect(() => {
      const fetchStory = async () => {
         try {
            const response = await fetch(`/api/stories/${id}`);
            if (!response.ok) {
               throw new Error("Failed to fetch story");
            }
            const data = await response.json();
            setStory(data);
            
            // Fetch author info if we have a userId
            if (data.userId) {
               fetchAuthorName(data.userId);
            }
         } catch (err) {
            console.error("Error fetching story:", err);
            setError("Failed to load the story. Please try again later.");
         } finally {
            setLoading(false);
         }
      };

      fetchStory();
   }, [id]);
   
   // Fetch author name from Clerk
   const fetchAuthorName = async (userId: string) => {
      try {
         const response = await fetch(`/api/users/${userId}`);
         if (response.ok) {
            const data = await response.json();
            setAuthorName(data.fullName || data.username || "Anonymous");
         }
      } catch (error) {
         console.error("Error fetching author info:", error);
         setAuthorName("Unknown Author");
      }
   };

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

   if (loading) {
      return (
         <main className="min-h-screen p-8 pb-16">
            <div className="max-w-3xl mx-auto text-center py-12">
               <p>Loading story...</p>
            </div>
         </main>
      );
   }

   if (error || !story) {
      return (
         <main className="min-h-screen p-8 pb-16">
            <Link
               href="/stories"
               className="inline-block mb-8 text-accent hover:underline"
            >
               ← Back to Stories
            </Link>
            <div className="max-w-3xl mx-auto text-center py-12">
               <p className="text-lg text-red-500">{error || "Story not found"}</p>
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
            <h1 className="text-4xl font-semibold mb-4">{story.title}</h1>
            
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
               </div>
            </div>

            <div className="space-y-8">
               {story.content.map((paragraph, index) => (
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
