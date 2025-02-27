import { Story } from "@/types/story";
import Link from "next/link";

interface StoryCardProps {
  story: Story;
  className?: string;
}

export default function StoryCard({ story, className = "" }: StoryCardProps) {
  return (
    <Link href={`/story/${story.id}`} className={`h-full ${className}`}>
      <div className="bg-card-bg rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <h2 className="text-2xl font-medium mb-4">{story.title}</h2>
        <div className="space-y-4 flex-grow">
          {/* Show only first paragraph as preview */}
          <div className="border-b border-accent/30 pb-4">
            <p className="text-text-secondary italic mb-2 line-clamp-3">
              {story.content[0].german}
            </p>
            <p className="text-sm text-text-secondary mt-auto">Click to read more...</p>
          </div>
        </div>
      </div>
    </Link>
  );
}