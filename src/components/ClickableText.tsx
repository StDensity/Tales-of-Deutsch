"use client";

import { useState, useRef, useEffect } from "react";
import {
   getWordDefinition,
   processWiktionaryData,
   getWordPronunciation,
} from "@/services/dictionaryService";
import { usePostHog } from "posthog-js/react";

interface ClickableTextProps {
   text: string;
   className?: string;
}

export default function ClickableText({
   text,
   className = "",
}: ClickableTextProps) {
   const [selectedWord, setSelectedWord] = useState<string | null>(null);
   const [definition, setDefinition] = useState<any>(null);
   const [loading, setLoading] = useState(false);
   const [tooltipStyle, setTooltipStyle] = useState({});
   const [showTooltip, setShowTooltip] = useState(false);
   const [showDictCcPronunciation, setShowDictCcPronunciation] =
      useState(false);
   const posthog = usePostHog();

   // Split text into words while preserving punctuation and spaces
   const words = text.split(/(\s+|[.,!?;:])/g).filter((word) => word !== "");

   // Fetch definition when a word is selected
   useEffect(() => {
      if (!selectedWord) return;

      const fetchData = async () => {
         setLoading(true);
         try {
            const rawData = await getWordDefinition(selectedWord);
            setDefinition(processWiktionaryData(rawData));
            // Removed audio fetching
         } catch (error) {
            console.error("Error fetching word data:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [selectedWord]);

   const handleWordClick = (word: string, event: React.MouseEvent) => {
      // Ignore punctuation and spaces
      if (/^\s+$|^[.,!?;:]$/.test(word)) return;

      // Track word click event in PostHog
      posthog?.capture("word_clicked", {
         word: word,
         language: "German",
      });

      // Get viewport-relative position
      const rect = (event.target as HTMLElement).getBoundingClientRect();

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate position for the tooltip
      const spaceBelow = viewportHeight - rect.bottom;
      const tooltipHeight = 300; // Approximate max height
      const tooltipWidth = Math.min(viewportWidth - 32, 400); // Responsive width with 16px padding on each side

      // Position above or below based on available space
      const positionAbove =
         spaceBelow < tooltipHeight && rect.top > tooltipHeight;

      // Calculate horizontal position, ensuring it stays within screen bounds
      let leftPosition = rect.left + rect.width / 2;

      // Adjust if too close to screen edge
      const minMargin = 16; // Minimum margin from screen edge
      if (leftPosition - tooltipWidth / 2 < minMargin) {
         leftPosition = tooltipWidth / 2 + minMargin;
      } else if (leftPosition + tooltipWidth / 2 > viewportWidth - minMargin) {
         leftPosition = viewportWidth - tooltipWidth / 2 - minMargin;
      }

      setTooltipStyle({
         position: "fixed",
         left: `${leftPosition}px`,
         top: positionAbove ? `${rect.top - 10}px` : `${rect.bottom + 10}px`,
         transform: positionAbove
            ? "translate(-50%, -100%)"
            : "translateX(-50%)",
         maxHeight: "300px",
         width: `${tooltipWidth}px`,
         maxWidth: "100%",
         overflowY: "auto",
         zIndex: 50,
      });

      setSelectedWord(word);
      setShowTooltip(true);
   };

   // Removed playPronunciation function
   // Close tooltip when clicking outside
   useEffect(() => {
      if (!showTooltip) return;

      const handleClickOutside = (e: MouseEvent) => {
         if (!(e.target as Element).closest(".word-tooltip")) {
            setShowTooltip(false);
            setShowDictCcPronunciation(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [showTooltip]);

   return (
      <div className={className}>
         {words.map((word, index) => {
            const isClickable = !/^\s+$|^[.,!?;:]$/.test(word);

            return (
               <span key={index}>
                  {isClickable ? (
                     <span
                        className="cursor-pointer hover:bg-highlight/30 rounded px-0.5 transition-colors"
                        onClick={(e) => handleWordClick(word, e)}
                     >
                        {word}
                     </span>
                  ) : (
                     word
                  )}
               </span>
            );
         })}

         {showTooltip && selectedWord && (
            <div
               className="word-tooltip fixed bg-card-bg text-text-primary shadow-lg rounded-lg p-4 custom-scrollbar"
               style={tooltipStyle}
            >
               <div className="word-definition">
                  <div className="flex justify-between items-center mb-2">
                     <h3 className="text-lg font-medium">{selectedWord}</h3>
                     <button
                        onClick={() => setShowDictCcPronunciation(true)}
                        className="text-accent hover:text-accent/80 text-sm"
                     >
                        🔊 Hear pronunciation
                     </button>
                  </div>

                  <iframe
                     src={`https://syn.dict.cc/dcc-gadget.php?s=${selectedWord}`}
                     className="w-full h-[75px] bg-background px-1.5 rounded"
                  ></iframe>
                  <div className="mt-2 pt-1 border-t border-accent/20" />

                  {loading ? (
                     <p>Loading...</p>
                  ) : definition ? (
                     <div>
                        <p className="text-sm text-text-secondary mb-2">
                           {definition.language} definition:
                        </p>

                        {definition.definitions.map((def: any, i: number) => (
                           <div key={i} className="mb-3">
                              <p className="font-medium italic">
                                 {def.partOfSpeech}
                              </p>

                              {def.meanings.map((meaning: any, j: number) => (
                                 <div key={j} className="ml-2 mb-2">
                                    <p>{meaning.definition}</p>

                                    {meaning.examples &&
                                       meaning.examples.length > 0 && (
                                          <div className="mt-1">
                                             <p className="text-sm font-medium">
                                                Examples:
                                             </p>
                                             <ul className="list-disc pl-5">
                                                {meaning.examples.map(
                                                   (
                                                      example: string,
                                                      k: number
                                                   ) => (
                                                      <li
                                                         key={k}
                                                         className="text-sm text-text-secondary"
                                                      >
                                                         {example}
                                                      </li>
                                                   )
                                                )}
                                             </ul>
                                          </div>
                                       )}

                                    {meaning.translations &&
                                       meaning.translations.length > 0 && (
                                          <div className="mt-2 pt-1 border-t border-accent/20">
                                             {meaning.translations.map(
                                                (trans: any, k: number) => (
                                                   <div
                                                      key={k}
                                                      className="text-sm"
                                                   >
                                                      <p>{trans.example}</p>
                                                      <p className="text-text-secondary">
                                                         {trans.translation}
                                                      </p>
                                                   </div>
                                                )
                                             )}
                                          </div>
                                       )}
                                 </div>
                              ))}
                           </div>
                        ))}
                        <p className="text-xs text-text-secondary mt-2 italic">
                           Powered by Wiktionary
                        </p>
                     </div>
                  ) : (
                     <div>
                        <p className="text-sm text-text-secondary mb-2">
                           Couldn't find any definition from Wiktionary.
                        </p>
                     </div>
                  )}

                  {showDictCcPronunciation && (
                     <div className="mt-3 border-t pt-3 border-accent/20">
                        <p className="text-sm font-medium mb-2">
                           Pronunciation from dict.cc:
                        </p>
                        <iframe
                           src={`https://www.dict.cc/?s=${selectedWord}`}
                           className="w-full h-[300px] bg-background rounded border border-accent/20"
                        ></iframe>
                     </div>
                  )}

                  <div className="flex justify-between mt-3">
                     <button
                        className="text-sm text-accent"
                        onClick={() => setShowTooltip(false)}
                     >
                        Close
                     </button>
                     {showDictCcPronunciation && (
                        <button
                           className="text-sm text-accent"
                           onClick={() => setShowDictCcPronunciation(false)}
                        >
                           Hide pronunciation
                        </button>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
