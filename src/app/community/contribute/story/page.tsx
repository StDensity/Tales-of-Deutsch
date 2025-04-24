"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommunityStoryContributionForm from "@/components/CommunityStoryContributionForm";
import { ParagraphInput, Category } from "@/types/story";
import { cefrLevelEnum } from "@/db/schema";
import DevelopmentDisclaimer from "@/components/DevelopmentDisclaimer";

// Import the template prompt
const storyTemplate = {
   normalPrompt:
      '1. Provide a **level** (A1 - B2).\n2. Provide a **category** (e.g., Mystery, Comedy, Sci-Fi, Adventure).\n3. Provide a **title** in German enclosed in a code block.\n4. Write the story in **german sentences according to the level**. Each paragraph should be enclosed in a code block.\n5. After each **German paragraph**, provide its **English translation** in a separate code block.\n6. Keep sentences **short and easy to understand**, using common vocabulary.\n7. Use **present tense** and **simple sentence structures**.\n8. The story should have a **fun or open ending** to engage the reader. Also it should be meaningful.\n9. Number each paragraph, for example, **"paragraph - 1"** before each set paragraph outside the code block.\n\nExample Output:\n\n**Level**: A1\n**Category**: Mystery\n**Title**:\n```Der geheimnisvolle Schlüssel```\n\n**Paragraph 1**\n```german paragraph-```\n```english paragraph```',
};

export default function ContributeStoryPage() {
   const { user, isLoaded, isSignedIn } = useUser();
   const router = useRouter();

   // Form states
   const [title, setTitle] = useState("");
   const [level, setLevel] = useState<string>("A1");
   const [categories, setCategories] = useState<Category[]>([]);
   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
   const [paragraphs, setParagraphs] = useState<ParagraphInput[]>([
      { german: "", english: "" },
   ]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState({ text: "", type: "" });
   const [showPrompt, setShowPrompt] = useState(false);

   // Fetch categories
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await fetch("/api/categories");
            if (response.ok) {
               const data = await response.json();
               setCategories(data);
            }
         } catch (error) {
            console.error("Error fetching categories:", error);
         }
      };

      fetchCategories();
   }, []);

   // Handle category selection
   const handleCategoryChange = (categoryId: number) => {
      setSelectedCategories((prev) =>
         prev.includes(categoryId)
            ? prev.filter((id) => id !== categoryId)
            : [...prev, categoryId]
      );
   };

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isSignedIn) {
         setMessage({
            text: "You must be signed in to contribute a story",
            type: "error",
         });
         return;
      }

      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      try {
         const response = await fetch("/api/stories/community/contribute", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title,
               level,
               isCommunity: true, // Always true for community stories
               categoryIds: selectedCategories,
               paragraphs: paragraphs.map((p, index) => ({
                  ...p,
                  paragraphOrder: index,
               })),
            }),
         });

         const data = await response.json();

         if (response.ok) {
            setMessage({
               text: "Story submitted successfully! It will be reviewed before publishing.",
               type: "success",
            });
            // Reset form
            setTitle("");
            setLevel("A1");
            setSelectedCategories([]);
            setParagraphs([{ german: "", english: "" }]);
         } else {
            setMessage({
               text: data.error || "Failed to submit story",
               type: "error",
            });
         }
      } catch (error) {
         console.error("Error submitting story:", error);
         setMessage({
            text: "An error occurred while submitting the story",
            type: "error",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   // Check if user is signed in
   useEffect(() => {
      if (isLoaded && !isSignedIn) {
         setMessage({
            text: "You need to be signed in to contribute a story. Please sign in first.",
            type: "error",
         });
      }
   }, [isLoaded, isSignedIn]);

   // Copy prompt to clipboard
   const copyPromptToClipboard = () => {
      navigator.clipboard.writeText(storyTemplate.normalPrompt);
      setMessage({ text: "Prompt copied to clipboard!", type: "success" });
      setTimeout(() => {
         setMessage({ text: "", type: "" });
      }, 3000);
   };

   return (
      <main className="min-h-screen p-8 pb-16">
         <Link
            href="/community"
            className="inline-block mb-8 text-accent hover:underline"
         >
            ← Back to Community Stories
         </Link>
         
         <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">Contribute a Story</h1>
            
            {/* Development Disclaimer */}
            <DevelopmentDisclaimer />
            
            {/* Community contribution guidelines */}
            <div className="bg-card-bg border-2 border-accent/20 p-6 rounded-lg mb-8">
               <h2 className="text-accent font-semibold text-xl mb-4">
                  Contribution Guidelines
               </h2>
               <ul className="list-disc pl-6 text-primary space-y-2">
                  <li>Stories should be appropriate for all audiences</li>
                  <li>Include accurate German text and English translations</li>
                  <li>Select the appropriate CEFR level for your content</li>
                  <li>
                     Choose relevant categories to help others find your story
                  </li>
                  <li>
                     This is a very small team, so we can't review every
                     submission. Please be mindful, thanks.
                  </li>
               </ul>
            </div>

            {/* LLM Story Generation Helper - Updated to be more minimalistic */}
            <div className="bg-card-bg border border-accent/20 p-6 rounded-lg mb-8">
               <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center justify-between w-full text-left"
               >
                  <h2 className="text-accent font-semibold text-xl">
                     Need Help Creating a Story?
                  </h2>
                  <svg 
                     xmlns="http://www.w3.org/2000/svg" 
                     className={`h-5 w-5 text-accent transition-transform duration-300 ${showPrompt ? 'rotate-180' : ''}`} 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
               </button>

               <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                     showPrompt ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
               >
                  <p className="mb-4">
                     You can use an AI assistant like{" "}
                     <a
                        href="https://t3.chat/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                     >
                        T3 Chat
                     </a>{" "}
                     to help generate a German story with English translations.
                  </p>

                  <div className="bg-background p-4 rounded-md mb-3 max-h-60 overflow-y-auto custom-scrollbar border border-accent/10">
                     <pre className="whitespace-pre-wrap text-sm text-text-secondary">
                        {storyTemplate.normalPrompt}
                     </pre>
                  </div>
                  
                  <button
                     onClick={copyPromptToClipboard}
                     className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 text-sm transition-colors"
                  >
                     Copy Prompt to Clipboard
                  </button>

                  <p className="mt-4 text-sm text-text-secondary">
                     After generating your story with the AI, copy and paste the paragraphs into the form below.
                  </p>
               </div>
            </div>

            {message.text && (
               <div
                  className={`p-4 mb-6 rounded-md ${
                     message.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
               >
                  {message.text}
               </div>
            )}

            <div className="bg-card-bg p-6 rounded-lg shadow-md">
               <form onSubmit={handleSubmit}>
                  <CommunityStoryContributionForm
                     title={title}
                     setTitle={setTitle}
                     level={level}
                     setLevel={setLevel}
                     categories={categories}
                     selectedCategories={selectedCategories}
                     handleCategoryChange={handleCategoryChange}
                     paragraphs={paragraphs}
                     setParagraphs={setParagraphs}
                     isSubmitting={isSubmitting}
                  />
               </form>
            </div>
         </div>
      </main>
   );
}
