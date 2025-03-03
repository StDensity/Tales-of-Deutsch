"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StoryCard from "@/components/StoryCard";
import { Story } from "@/types/story";

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedStories = async () => {
      try {
        const response = await fetch('/api/stories/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured stories');
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching featured stories:', error);
        setError('Failed to load featured stories');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-text-secondary">Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <section className="px-8 pb-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">Featured Stories</h2>
        
        {stories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-text-secondary">No stories available yet. Check back soon!</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            href="/stories" 
            className="inline-block border-2 border-accent text-accent px-6 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
          >
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  );
}