"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Place, PlaceVocabulary } from "@/types/place";
import { Loader2, AlertCircle, MapPin, ChartNoAxesGantt } from "lucide-react";
import { useState } from "react";
import ClickableText from "@/components/ClickableText"; // Import ClickableText component

// Define the expected shape of the API response
interface PlaceData {
   placeDetails: Place;
   vocabularies: PlaceVocabulary[];

}

// Function to fetch place data (name and vocabulary)
const fetchPlaceData = async (placeId: number): Promise<PlaceData> => {
   const response = await fetch(`/api/places/${placeId}`);
   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
         errorData.error || `Failed to fetch place data: ${response.statusText}`
      );
   }
   return response.json();
};

// Add function to fetch author name
const fetchAuthorName = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }
  const data = await response.json();
  return data.fullName || data.username || "Anonymous";
};


export default function PlaceDetailPage() {
   const params = useParams();
   const placeIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
   const placeId = placeIdParam ? parseInt(placeIdParam, 10) : NaN;

   const [visibleTranslations, setVisibleTranslations] = useState<number[]>([]);
   const [primaryLanguage, setPrimaryLanguage] = useState<"german" | "english">(
      "german"
   );

   const {
      data,
      isLoading,
      error,
      isError,
   } = useQuery<PlaceData, Error>({
      queryKey: ["placeData", placeId],
      queryFn: () => fetchPlaceData(placeId),
      enabled: !isNaN(placeId),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
   });

   // Add query to fetch author name
   const { data: authorName = "Unknown Author" } = useQuery({
     queryKey: ['author', data?.placeDetails?.userId],
     queryFn: () => fetchAuthorName(data?.placeDetails?.userId as string),
     enabled: !!data?.placeDetails?.userId, // Only run query if userId exists
   });

   // Function to toggle individual secondary translation visibility
   const toggleTranslation = (id: number) => {
      setVisibleTranslations((prev) =>
         prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
   };

   // Function to switch primary language and reset visible translations
   const switchPrimaryLanguage = (lang: "german" | "english") => {
      setPrimaryLanguage(lang);
      setVisibleTranslations([]);
   };

   // Handle invalid ID case early
   if (isNaN(placeId)) {
      return (
         <main className="min-h-screen p-8 pb-16">
            <Link
               href="/places"
               className="inline-block mb-8 text-accent hover:underline"
            >
               ← Back to Places
            </Link>
            <div className="max-w-3xl mx-auto text-center py-10">
               <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
               <h1 className="text-2xl font-semibold mb-2">Invalid Place ID</h1>
               <p className="text-muted-foreground">
                  The ID provided in the URL is not valid.
               </p>
            </div>
         </main>
      );
   }

   return (
      <main className="min-h-screen p-8 pb-16">
         <Link
            href="/places"
            className="inline-block mb-8 text-accent hover:underline"
         >
            ← Back to Places
         </Link>

         <article className="max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-4">
               <h1 className="text-4xl font-semibold flex items-center">
                  <MapPin className="mr-3 h-7 w-7 text-primary shrink-0" />
                  <span className="truncate">
                     {isLoading
                        ? "Loading Place..."
                        : data?.placeDetails.name || `Place #${placeId}`}
                  </span>
               </h1>
            </div>
            
            {/* Add metadata section with author and date */}
            {!isLoading && !isError && data && (
               <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                  {data.placeDetails.isCommunity && (
                     <div className="bg-accent/20 text-accent px-4 py-2 rounded-md font-medium">
                        Community
                     </div>
                  )}
                  <div className="flex items-center gap-4">
                     {data.placeDetails.createdAt && (
                        <div className="flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                           <span className="text-text-secondary">
                              {new Date(data.placeDetails.createdAt).toLocaleDateString('en-US', {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric'
                              })}
                           </span>
                        </div>
                     )}
                     {authorName && (
                        <div className="flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                           </svg>
                           <span className="text-text-secondary">{authorName}</span>
                        </div>
                     )}
                     <div className="flex items-center">
                        <ChartNoAxesGantt className="text-text-secondary"/>
                        <span className="text-text-secondary">{data.vocabularies.length} words</span>
                     </div>
                  </div>
               </div>
            )}

            <div className="flex items-center justify-end space-x-2 mb-8">
               <button
                  onClick={() => switchPrimaryLanguage("german")}
                  title="Show German first"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                     primaryLanguage === "german"
                        ? "bg-accent/20 text-accent font-medium"
                        : "bg-transparent text-text-secondary hover:bg-muted"
                  }`}
               >
                  German
               </button>
               <button
                  onClick={() => switchPrimaryLanguage("english")}
                  title="Show English first"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                     primaryLanguage === "english"
                        ? "bg-accent/20 text-accent font-medium"
                        : "bg-transparent text-text-secondary hover:bg-muted"
                  }`}
               >
                  English
               </button>
            </div>

            {isLoading && (
               <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <span className="ml-2 text-lg">Loading vocabulary...</span>
               </div>
            )}

            {isError && (
               <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 text-destructive mr-3" />
                  <p className="text-sm text-destructive-foreground">
                     <strong>Error:</strong>{" "}
                     {error?.message || "Failed to load vocabulary"}
                  </p>
               </div>
            )}

            {!isLoading &&
               !isError &&
               data &&
               data.vocabularies.length === 0 && (
                  <p className="text-center text-text-secondary py-12">
                     No vocabulary found for this place.
                  </p>
               )}

            {!isLoading && !isError && data && data.vocabularies.length > 0 && (
               <div className="space-y-8">
                  {data.vocabularies.map((vocab) => {
                     // Determine primary and secondary based on state
                     const primaryText =
                        primaryLanguage === "german" ? vocab.german : vocab.english;
                     const secondaryText =
                        primaryLanguage === "german" ? vocab.english : vocab.german;
                     const secondaryLangName =
                        primaryLanguage === "german" ? "English" : "German";

                     return (
                        <div
                           key={vocab.id}
                           className="bg-card-bg rounded-lg p-6 shadow-sm"
                        >
                           {/* Use ClickableText for German words when German is primary */}
                           {primaryLanguage === "german" ? (
                              <ClickableText
                                 text={primaryText}
                                 className="text-lg mb-4"
                              />
                           ) : (
                              <p className="text-lg mb-4">
                                 {primaryText}
                              </p>
                           )}

                           <button
                              onClick={() => toggleTranslation(vocab.id)}
                              className="text-accent hover:text-accent/80 transition-colors"
                           >
                              {visibleTranslations.includes(vocab.id)
                                 ? "Hide"
                                 : "Show"}{" "}
                              {secondaryLangName}
                           </button>

                           <div
                              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                 visibleTranslations.includes(vocab.id)
                                    ? "max-h-[500px] opacity-100 mt-4"
                                    : "max-h-0 opacity-0"
                              }`}
                           >
                              {/* Use ClickableText for German words when English is primary */}
                              {primaryLanguage === "english" ? (
                                 <ClickableText
                                    text={secondaryText}
                                    className="text-text-secondary italic"
                                 />
                              ) : (
                                 <p className="text-text-secondary italic">
                                    {secondaryText}
                                 </p>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
            
            {!isLoading && !isError && data && data.vocabularies.length > 0 && (
               <div className="mt-12 mb-4 text-center">
                  <p className="text-xs text-text-secondary italic">
                     Words and its translations are generated with LLM.
                  </p>
               </div>
            )}
         </article>
      </main>
   );
}
