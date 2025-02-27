import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-block mb-8 text-accent hover:underline"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-semibold mb-8">About Tales of Deutsch</h1>
        
        <div className="prose prose-lg">
          <p>
            Welcome to Tales of Deutsch, an interactive platform designed to help you learn German through engaging stories.
          </p>
          
          <h2 className="text-2xl font-medium mt-8 mb-4">How It Works</h2>
          <p>
            Each story is presented in German with the ability to reveal English translations paragraph by paragraph. 
            This approach allows you to challenge yourself with comprehension while having immediate access to translations when needed.
          </p>
          
          <h2 className="text-2xl font-medium mt-8 mb-4">Our Approach</h2>
          <p>
            Learning a language is most effective when it's enjoyable and contextual. Our stories provide:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Engaging narratives that keep you interested</li>
            <li>Vocabulary in natural context</li>
            <li>Progressive difficulty levels</li>
            <li>Cultural insights through storytelling</li>
          </ul>
          
          <h2 className="text-2xl font-medium mt-8 mb-4">Get Started</h2>
          <p>
            Browse our collection of stories and start reading at your own pace. Toggle translations as needed and gradually build your confidence in German reading comprehension.
          </p>
          
          <div className="mt-8">
            <Link 
              href="/" 
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors inline-block"
            >
              Explore Stories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}