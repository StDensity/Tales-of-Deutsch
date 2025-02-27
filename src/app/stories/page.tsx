import StoryCard from "@/components/StoryCard";
import { dummyStories } from "@/data/dummyStories";
import Link from "next/link";

export default function StoriesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold">All Stories</h1>
          <Link 
            href="/" 
            className="text-accent hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyStories.map((story) => (
            <div key={story.id} className="h-full flex">
              <StoryCard story={story} className="flex-1 flex flex-col" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}