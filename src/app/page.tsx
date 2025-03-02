import StoryCard from "@/components/StoryCard";
import { getAllStories } from "@/services/storyService";
import Link from "next/link";

export default async function Home() {
  // Get just the first 2 stories for the homepage
  const allStories = await getAllStories();
  const featuredStories = allStories.slice(0, 2);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-card-bg py-16 px-8 mb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Tales of Deutsch</h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Improve your German language skills through engaging stories with interactive translations.
          </p>
          <Link 
            href="/stories" 
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Featured Stories</h2>
          
          {featuredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredStories.map((story) => (
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
      
      {/* Call to Action */}
      <section className="bg-highlight/20 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to improve your German?</h2>
          <p className="mb-6">Explore our full collection of stories and start learning today.</p>
          <Link 
            href="/about" 
            className="bg-accent text-white px-5 py-2 rounded-lg hover:bg-accent/80 transition-colors inline-block mr-4"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}