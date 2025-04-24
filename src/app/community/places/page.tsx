"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Place } from "@/types/place";
import { Loader2, AlertCircle, MapPin, Plus, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Function to fetch community places
const fetchCommunityPlaces = async (): Promise<Place[]> => {
  const response = await fetch("/api/places/community");
  if (!response.ok) {
    throw new Error(`Failed to fetch community places: ${response.statusText}`);
  }
  return response.json();
};

export default function CommunityPlacesPage() {
  // Using React Query to fetch community places
  const {
    data: places,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["communityPlaces"],
    queryFn: fetchCommunityPlaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <main className="min-h-screen p-8 pb-16">
      <Link
        href="/places"
        className="inline-block mb-8 text-accent hover:underline"
      >
        ← Back to Places
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold flex items-center">
            <MapPin className="mr-3 h-7 w-7 text-primary" />
            Community Places
          </h1>
          <Link
                  href="/community/contribute"
                  className="px-5 py-2.5 relative text-sm sm:text-base bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-sm group"
               >
                  <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-highlight px-2 py-0.5 rounded-full text-white font-medium shadow-md border border-white/20 text-xs">
                     AI <Sparkles className="size-3.5 animate-pulse" />
                  </span>
                  <p className="flex items-center text-xs md:text-base text-nowrap">
                     Contribute
                  </p>
               </Link>
        </div>

        <div className="bg-card-bg border-2 border-accent/20 p-6 rounded-lg mb-8">
          <h2 className="text-accent font-semibold text-xl mb-4">
            Community-Contributed Places
          </h2>
          <p className="mb-4">
            Explore places and vocabulary contributed by the community. Each place contains German vocabulary with English translations to help you learn words in context.
          </p>
          <p className="text-sm text-text-secondary">
            Want to contribute? Click the "Contribute Place" button above to add your own vocabulary list.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-2 text-lg">Loading community places...</span>
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-3" />
            <p className="text-sm text-destructive-foreground">
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to load community places"}
            </p>
          </div>
        )}

        {!isLoading && !isError && places && places.length === 0 && (
          <div className="text-center py-12 bg-card-bg rounded-lg border border-border">
            <MapPin className="h-12 w-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No community places yet</p>
            <p className="text-text-secondary mb-6">
              Be the first to contribute a place with vocabulary!
            </p>
            <Link
              href="/community/contribute"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Contribute
            </Link>
          </div>
        )}

        {!isLoading && !isError && places && places.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <h2 className="text-xl font-medium mb-2 text-card-foreground truncate">
                    {place.name}
                  </h2>
                  <Link
                    href={`/places/${place.id}`}
                    className="text-accent hover:underline text-sm mt-2 inline-block"
                  >
                    View Vocabulary →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI-generated content notification */}
        <div className="mt-12 mb-4 text-center">
          <p className="text-xs text-text-secondary italic">
            Words and translations are generated with LLM.
          </p>
        </div>
      </div>
    </main>
  );
}