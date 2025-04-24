"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from "react";
import Link from "next/link";
import StoryCard from "@/components/StoryCard";
import { Story } from "@/types/story";

export default function CommunityStoriesPage() {
   const [stories, setStories] = useState<Story[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchCommunityStories = async () => {
         try {
            const response = await fetch("/api/stories/community");
            if (!response.ok) {
               throw new Error("Failed to fetch community stories");
            }
            const data = await response.json();
            setStories(data);
         } catch (error) {
            console.error("Error fetching community stories:", error);
            setError(
               "Failed to load community stories. Please try again later."
            );
         } finally {
            setLoading(false);
         }
      };

      fetchCommunityStories();
   }, []);

   return (
      <main className="min-h-screen p-8 pb-16">
         <Link
            href="/"
            className="inline-block mb-8 text-accent hover:underline"
         >
            ← Back to Home
         </Link>

         <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
               <h1 className="sm:text-4xl font-semibold text-2xl ">
                  Community Stories
               </h1>
               <Link
                  href="/community/contribute"
                  className="px-5 py-2.5 relative text-sm sm:text-base bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-sm group"
               >
                  <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-highlight px-2 py-0.5 rounded-full text-white font-medium shadow-md border border-white/20 text-xs">
                     AI <Sparkles className="size-3.5 animate-pulse" />
                  </span>
                  <p className="flex items-center text-xs md:text-base text-nowrap">
                     Contribute
                  </p>
               </Link>
            </div>
            {/* Disclaimer Banner */}
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-md mb-8">
               <h2 className="text-accent font-medium text-lg mb-2">
                  Community Content Disclaimer
               </h2>
               <p className="text-accent/80">
                  Stories in this section are contributed by community members
                  and are not developed or reviewed by Tales of Deutsch. We are
                  not responsible for the content, accuracy, or appropriateness
                  of these stories. Please report any inappropriate content.
               </p>
            </div>

            {loading ? (
               <div className="text-center py-12">
                  <p className="text-lg text-text-secondary">
                     Loading community stories...
                  </p>
               </div>
            ) : error ? (
               <div className="text-center py-12">
                  <p className="text-lg text-red-500">{error}</p>
               </div>
            ) : stories.length > 0 ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story) => (
                     <StoryCard key={story.id} story={story} />
                  ))}
               </div>
            ) : (
               <div className="justify-center text-lg flex py-12 gap-1">
                  <p className=" text-text-secondary">
                     No community stories available yet. Be the first to{" "}
                  </p>{" "}
                  <Link
                     className="text-accent font-bold underline"
                     href={"community/contribute"}
                  >
                     contribute!
                  </Link>
               </div>
            )}
         </div>
      </main>
   );
}
