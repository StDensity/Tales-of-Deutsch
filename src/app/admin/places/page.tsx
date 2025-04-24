"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, X, Copy, ChevronDown, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

// Types for place and vocabulary
interface VocabularyInput {
  german: string;
  english: string;
}

// Update the interface to match the API expectations
interface PlaceInput {
  placeName: string;  // Changed from 'name' to 'placeName'
  vocabularyList: VocabularyInput[];  // Changed from 'vocabulary' to 'vocabularyList'
}

// AI prompt template for generating vocabulary
const getVocabularyPrompt = (placeName: string) => `Create a vocabulary list for "${placeName}" in German with English translations.

The vocabulary should be appropriate for language learners and include about 30 words commonly found or used in this location. If you can't find 30 words without repitions don't do 30. If you can do more than that pleases do.

For each word, provide:
1. The German word (with article for nouns)
2. The English translation

Format your response as a JSON array with the following structure:
\`\`\`json
[
  {
    "german": "der Tisch",
    "english": "table"
  },
  {
    "german": "der Stuhl",
    "english": "chair"
  }
]
\`\`\`

Word difficulty: all levels 

Include a variety of word types (nouns, verbs, adjectives) that would be useful for someone visiting or talking about this place.`;

// API fetch functions
const checkAdminStatus = async () => {
  const response = await fetch("/api/admin/check");
  if (!response.ok) {
    throw new Error("Failed to check admin status");
  }
  const data = await response.json();
  return data.isAdmin;
};

const createPlace = async (placeData: PlaceInput) => {
  const response = await fetch("/api/admin/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(placeData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add place");
  }
  return data;
};

export default function AdminPlacesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Form states
  const [placeName, setPlaceName] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Query for admin status
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: checkAdminStatus,
    enabled: isLoaded && !!user,
  });
  
  // Mutation for creating a place
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      // Reset form
      setPlaceName("");
      setJsonInput("");
      setMessage({ text: "Place added successfully!", type: "success" });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: (error: Error) => {
      setMessage({ text: error.message || "Failed to add place", type: "error" });
    },
  });
  
  // Parse and validate JSON input
  const validateJsonInput = () => {
    setJsonError("");
    
    if (!jsonInput.trim()) {
      setJsonError("JSON input is empty");
      return false;
    }
    
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        setJsonError("JSON must be an array of vocabulary items");
        return false;
      }
      
      if (parsed.length === 0) {
        setJsonError("At least one vocabulary item is required");
        return false;
      }
      
      const isValid = parsed.every((item: any) => 
        typeof item === 'object' && 
        typeof item.german === 'string' && 
        item.german.trim() !== '' && 
        typeof item.english === 'string' && 
        item.english.trim() !== ''
      );
      
      if (!isValid) {
        setJsonError("Each item must have non-empty 'german' and 'english' properties");
        return false;
      }
      
      return true;
    } catch (error) {
      setJsonError("Invalid JSON format: " + (error as Error).message);
      return false;
    }
  };
  
  // Copy prompt to clipboard
  const copyPromptToClipboard = () => {
    const prompt = getVocabularyPrompt(placeName);
    navigator.clipboard.writeText(prompt);
    setMessage({ text: "Prompt copied to clipboard!", type: "success" });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    // Validate form
    if (!placeName.trim()) {
      setMessage({ text: "Place name is required", type: "error" });
      return;
    }
    
    // Validate JSON input
    if (!validateJsonInput()) {
      return;
    }
    
    try {
      const vocabularyList = JSON.parse(jsonInput);
      
      // Submit the data
      mutate({
        placeName: placeName,
        vocabularyList: vocabularyList,
      });
    } catch (error) {
      setJsonError("Failed to process JSON: " + (error as Error).message);
    }
  };
  
  if (isAdminLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
        <span className="ml-3">Checking admin status...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="mb-6">You do not have permission to access this page.</p>
          <Link href="/admin" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80">
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen p-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Admin: Add New Place</h1>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
        
        {/* AI Vocabulary Generation Helper */}
        <div className="bg-card-bg border border-accent/20 p-6 rounded-lg mb-8">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-accent font-semibold text-xl">
              Need Help Generating Vocabulary?
            </h2>
            <ChevronDown 
              className={`h-5 w-5 text-accent transition-transform duration-300 ${showPrompt ? 'rotate-180' : ''}`}
            />
          </button>

          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showPrompt ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="mb-4">
              You can use an AI assistant like{" "}
              <a
                href="https://chat.openai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ChatGPT
              </a>{" "}
              or{" "}
              <a
                href="https://t3.chat/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                T3 Chat
              </a>{" "}
              to generate vocabulary in JSON format that you can easily paste into this form.
            </p>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm overflow-y-auto max-h-48 custom-scrollbar">
              <p className="font-medium">How to use:</p>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Enter the place name in the form below</li>
                <li>Click "Copy AI Prompt" to copy the prompt with your place name</li>
                <li>Paste the prompt into your AI assistant</li>
                <li>Copy the JSON output from the AI</li>
                <li>Paste it into the JSON vocabulary field below</li>
                <li>Submit the form to add the place with its vocabulary</li>
              </ol>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg shadow-md">
          {/* Place Name Field with Copy Button */}
          <div className="mb-6">
            <label htmlFor="placeName" className="block text-sm font-medium mb-2">
              Place Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="placeName"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="flex-1 p-3 border border-border rounded-md bg-background"
                placeholder="Enter place name (e.g., Park, Café, Supermarket)"
                required
              />
              <button
                type="button"
                onClick={copyPromptToClipboard}
                disabled={!placeName.trim()}
                className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center whitespace-nowrap ${
                  placeName.trim() 
                    ? "bg-accent text-white hover:bg-accent/80" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy AI Prompt
              </button>
            </div>
          </div>
          
          {/* JSON Vocabulary Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="jsonVocabulary" className="block text-sm font-medium">
                Vocabulary (JSON Format)
              </label>
            </div>
            <textarea
              id="jsonVocabulary"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full p-3 border border-border rounded-md bg-background font-mono text-sm h-64"
              placeholder='[{"german": "der Tisch", "english": "table"}, {"german": "der Stuhl", "english": "chair"}]'
              required
            />
            {jsonError && (
              <div className="mt-2 text-sm text-destructive flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Paste the JSON array of vocabulary items generated by AI. Each item should have "german" and "english" properties.
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding Place...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-2" />
                  Add Place
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}