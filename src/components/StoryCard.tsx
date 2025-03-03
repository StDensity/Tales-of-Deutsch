import { Story } from "@/types/story";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StoryCardProps {
  story: Story;
  className?: string;
}

export default function StoryCard({ story, className = "" }: StoryCardProps) {
  const [authorName, setAuthorName] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  // Fetch author name
  useEffect(() => {
    const fetchAuthorName = async () => {
      if (story.userId) {
        try {
          const response = await fetch(`/api/users/${story.userId}`);
          if (response.ok) {
            const data = await response.json();
            setAuthorName(data.fullName || data.username || "Anonymous");
          }
        } catch (error) {
          console.error("Error fetching author info:", error);
          setAuthorName("Unknown Author");
        }
      }
    };

    // Fetch category
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/stories/${story.id}/category`);
        if (response.ok) {
          const data = await response.json();
          if (data.categories && data.categories.length > 0) {
            setCategory(data.categories[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchAuthorName();
    fetchCategory();
  }, [story.userId, story.id]);

  return (
    <Link href={`/story/${story.id}`} className={`h-full ${className}`}>
      <div className="bg-card-bg rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">

        {/* Metadata section */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <div className="bg-accent/20 text-accent px-2 py-1 rounded-md">
            {story.level}
          </div>
          
          {authorName && (
            <div className="flex items-center text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {authorName}
              
            </div>
          )}
          {category && (
            <div className="flex items-center text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {category}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-medium mb-2">{story.title}</h2>
        
        {/* Main content area with flex-grow to push the bottom line down */}
        <div className="flex flex-col flex-grow justify-between">
          {/* Preview text that can vary in height */}
          <div className="mb-auto">
            <p className="text-text-secondary italic line-clamp-3">
              {story.content[0].german}
            </p>
          </div>
          
          {/* Bottom line that will always be at the bottom */}
          <div className="border-t border-accent/30 pt-3 mt-4">
            {/* <p className="text-sm text-text-secondary">Read more</p> */}
          </div>
        </div>
      </div>
    </Link>
  );
}