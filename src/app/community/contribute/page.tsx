"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, BookOpen } from "lucide-react";

export default function ContributePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8 pb-16">
      <Link
        href="/community"
        className="inline-block mb-8 text-accent hover:underline"
      >
        ← Back to Community
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Contribute to Tales of Deutsch</h1>
        
        <div className="bg-card-bg border-2 border-accent/20 p-6 rounded-lg mb-8">
          <h2 className="text-accent font-semibold text-xl mb-4">
            Community Contribution
          </h2>
          <p className="mb-4">
            Help grow our learning resources by contributing your own content. Choose one of the options below:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Story Contribution Card */}
          <Link 
            href="/community/contribute/story"
            className="block"
            onMouseEnter={() => setHoveredCard('story')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`bg-card-bg rounded-lg p-6 shadow-md h-full border-2 transition-all duration-300 ${
              hoveredCard === 'story' ? 'border-accent' : 'border-transparent'
            }`}>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-accent mr-3" />
                <h2 className="text-2xl font-medium">Contribute a Story</h2>
              </div>
              <p className="text-text-secondary mb-4">
                Share German stories with English translations to help others learn through engaging narratives.
              </p>
              <ul className="list-disc pl-6 text-primary space-y-1 mb-6">
                <li>Write stories at different CEFR levels</li>
                <li>Include both German text and English translations</li>
                <li>Help learners practice reading comprehension</li>
              </ul>
              <div className={`text-accent font-medium transition-all duration-300 ${
                hoveredCard === 'story' ? 'translate-x-2' : ''
              }`}>
                Get started →
              </div>
            </div>
          </Link>
          
          {/* Place Contribution Card */}
          <Link 
            href="/community/contribute/place"
            className="block"
            onMouseEnter={() => setHoveredCard('place')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`bg-card-bg rounded-lg p-6 shadow-md h-full border-2 transition-all duration-300 ${
              hoveredCard === 'place' ? 'border-accent' : 'border-transparent'
            }`}>
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-accent mr-3" />
                <h2 className="text-2xl font-medium">Contribute a Place</h2>
              </div>
              <p className="text-text-secondary mb-4">
                Add vocabulary lists for different places to help learners build their German vocabulary in context.
              </p>
              <ul className="list-disc pl-6 text-primary space-y-1 mb-6">
                <li>Create vocabulary for specific locations</li>
                <li>Provide German words with English translations</li>
                <li>Help learners expand their practical vocabulary</li>
              </ul>
              <div className={`text-accent font-medium transition-all duration-300 ${
                hoveredCard === 'place' ? 'translate-x-2' : ''
              }`}>
                Get started →
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            All contributions are reviewed before being published. Thank you for helping the community learn German!
          </p>
        </div>
      </div>
    </main>
  );
}