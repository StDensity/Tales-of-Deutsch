'use client';

import { dummyStories } from "@/data/dummyStories";
import { useState, use } from "react";
import Link from "next/link";

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const story = dummyStories.find(s => s.id === parseInt(resolvedParams.id));
  const [visibleTranslations, setVisibleTranslations] = useState<number[]>([]);

  if (!story) {
    return <div>Story not found</div>;
  }

  const toggleTranslation = (index: number) => {
    setVisibleTranslations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <main className="min-h-screen p-8">
      <Link 
        href="/" 
        className="inline-block mb-8 text-accent hover:underline"
      >
        ← Back to Stories
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">{story.title}</h1>
        
        <div className="space-y-8">
          {story.content.map((paragraph, index) => (
            <div 
              key={index} 
              className="bg-card-bg rounded-lg p-6"
            >
              <p className="text-lg mb-4">{paragraph.german}</p>
              
              <button
                onClick={() => toggleTranslation(index)}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                {visibleTranslations.includes(index) ? 'Hide' : 'Show'} Translation
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  visibleTranslations.includes(index) ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-text-secondary italic">
                  {paragraph.english}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}