'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Place } from '@/types/place'; // Import the Place type
import { Loader2, AlertCircle } from 'lucide-react'; // Icons for loading/error states

// Function to fetch featured places
const fetchFeaturedPlaces = async (): Promise<Place[]> => {
  const response = await fetch('/api/places/featured'); // Assumes this API endpoint exists
  if (!response.ok) {
    throw new Error(`Failed to fetch featured places: ${response.statusText}`);
  }
  return response.json();
};

export default function FeaturedPlaces() {
  const {
    data: places,
    isLoading,
    error,
    isError,
  } = useQuery<Place[], Error>({
    queryKey: ['featuredPlaces'], // Unique key for this query
    queryFn: fetchFeaturedPlaces, // The function to fetch data
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes of inactivity
  });

  return (
    <section className="px-8 pb-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">Featured Places</h2>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-2 text-lg">Loading places...</span>
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 rounded-md flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-3" />
            <p className="text-sm text-destructive-foreground">
              <strong>Error:</strong> {error?.message || 'Failed to load featured places'}
            </p>
          </div>
        )}

        {!isLoading && !isError && places && places.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              // Basic card structure - can be replaced with a dedicated PlaceCard component later
              <div key={place.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <h3 className="text-xl font-medium mb-2 text-card-foreground">{place.name}</h3>
                  <Link
                    href={`/places/${place.id}`} // Link to the specific place page
                    className="text-accent hover:underline text-sm mt-2 inline-block"
                  >
                    View Vocabulary →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (!places || places.length === 0) && (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No featured places available yet.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/places" // Link to the main places page
            className="inline-block border-2 border-accent text-accent px-6 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
          >
            View All Places
          </Link>
        </div>
      </div>
    </section>
  );
}