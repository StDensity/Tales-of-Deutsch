'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Place } from '@/types/place'; // Import the Place type
import { Loader2, AlertCircle } from 'lucide-react'; // Icons for loading/error states

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/places'); // Use the API route
        if (!response.ok) {
          throw new Error(`Failed to fetch places: ${response.statusText}`);
        }
        const data: Place[] = await response.json();
        setPlaces(data);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <main className="min-h-screen p-8 pb-16">
      <Link
        href="/"
        className="inline-block mb-8 text-accent hover:underline"
      >
        ← Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Explore Places</h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-2 text-lg">Loading places...</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-3" />
            <p className="text-sm text-destructive-foreground">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <p className="text-center text-text-secondary py-10">No places found.</p>
        )}

        {!loading && !error && places.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <h2 className="text-xl font-medium mb-2 text-card-foreground">{place.name}</h2>
                  {/* You can add more details here later, e.g., link to the place detail page */}
                  {/* <p className="text-sm text-muted-foreground">Created by: {place.userId}</p> */}
                  {/* <p className="text-sm text-muted-foreground">Community: {place.isCommunity ? 'Yes' : 'No'}</p> */}
                   <Link
                     href={`/places/${place.id}`} // Assuming a dynamic route like /places/[id] will exist
                     className="text-accent hover:underline text-sm mt-2 inline-block"
                   >
                     View Vocabulary →
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}