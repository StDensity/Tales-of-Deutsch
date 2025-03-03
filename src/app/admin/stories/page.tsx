"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import StoryFormManual from "@/components/StoryFormManual";
import { ParagraphInput, Category } from "@/types/story";
import { cefrLevelEnum } from "@/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API fetch functions
const checkAdminStatus = async () => {
  const response = await fetch("/api/admin/check");
  if (!response.ok) {
    throw new Error("Failed to check admin status");
  }
  const data = await response.json();
  return data.isAdmin;
};

const fetchCategories = async () => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

const createStory = async (storyData: any) => {
  const response = await fetch("/api/admin/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storyData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add story");
  }
  return data;
};

export default function AdminStoriesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cefrLevels = cefrLevelEnum.enumValues;
  
  // Form states
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("A1");
  const [isCommunity, setIsCommunity] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [paragraphs, setParagraphs] = useState<ParagraphInput[]>([
    { german: "", english: "" },
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });
  // Query for admin status
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: checkAdminStatus,
    enabled: isLoaded && !!user,
  });
  // Query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  // Mutation for creating a story
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      // Reset form
      setTitle("");
      setLevel("A1");
      setIsCommunity(true);
      setSelectedCategories([]);
      setParagraphs([{ german: "", english: "" }]);
      setMessage({ text: "Story added successfully!", type: "success" });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
    onError: (error: Error) => {
      setMessage({ text: error.message || "Failed to add story", type: "error" });
    },
  });
  
  // Handle category selection
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    mutate({
      title,
      level,
      isCommunity,
      categoryIds: selectedCategories,
      paragraphs: paragraphs.map((p, index) => ({
        ...p,
        paragraphOrder: index,
      })),
    });
  };
  
  if (isAdminLoading) return <div className="min-h-screen p-8">Loading...</div>;
  if (!isAdmin) return null;
  
  return (
    <main className="min-h-screen p-8 pb-16">
      <h1 className="text-3xl font-semibold mb-8">Admin: Add New Story</h1>
  
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
  
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg shadow-md">
          <StoryFormManual
            title={title}
            setTitle={setTitle}
            level={level}
            setLevel={setLevel}
            isCommunity={isCommunity}
            setIsCommunity={setIsCommunity}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            paragraphs={paragraphs}
            setParagraphs={setParagraphs}
          />
  
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 disabled:opacity-50"
            >
              {isSubmitting ? "Adding Story..." : "Add Story"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}