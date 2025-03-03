"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import StoryFormManual from "@/components/StoryFormManual";
import { ParagraphInput, Category } from "@/types/story";
import { cefrLevelEnum } from "@/db/schema";

export default function AdminStoriesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("A1");
  const [isCommunity, setIsCommunity] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [paragraphs, setParagraphs] = useState<ParagraphInput[]>([
    { german: "", english: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const cefrLevels = cefrLevelEnum.enumValues;
  
  // Check if the current user is the admin
  useEffect(() => {
    if (isLoaded) {
      const checkAdmin = async () => {
        try {
          const response = await fetch("/api/admin/check");
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      };
  
      checkAdmin();
    }
  }, [isLoaded, user]);
  
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
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
  
    try {
      const response = await fetch("/api/admin/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          level,
          isCommunity,
          categoryIds: selectedCategories,
          paragraphs: paragraphs.map((p, index) => ({
            ...p,
            paragraphOrder: index,
          })),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage({ text: "Story added successfully!", type: "success" });
        // Reset form
        setTitle("");
        setLevel("A1");
        setIsCommunity(true);
        setSelectedCategories([]);
        setParagraphs([{ german: "", english: "" }]);
      } else {
        setMessage({ text: data.error || "Failed to add story", type: "error" });
      }
    } catch (error) {
      console.error("Error adding story:", error);
      setMessage({ text: "An error occurred while adding the story", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="min-h-screen p-8">Loading...</div>;
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