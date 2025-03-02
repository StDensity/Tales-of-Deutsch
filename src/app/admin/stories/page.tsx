"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cefrLevelEnum } from "@/db/schema";

interface ParagraphInput {
  german: string;
  english: string;
}

export default function AdminStoriesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("A1");
  const [paragraphs, setParagraphs] = useState<ParagraphInput[]>([
    { german: "", english: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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

  // Redirect non-admin users
  useEffect(() => {
    if (isLoaded && !isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoaded, isLoading, router]);

  const handleParagraphChange = (index: number, field: keyof ParagraphInput, value: string) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs[index][field] = value;
    setParagraphs(updatedParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { german: "", english: "" }]);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length > 1) {
      const updatedParagraphs = paragraphs.filter((_, i) => i !== index);
      setParagraphs(updatedParagraphs);
    }
  };

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

  if (isLoading) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  // Get the actual CEFR level values from the enum
  const cefrLevels = cefrLevelEnum.enumValues;

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

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-card-bg p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-background"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="level" className="block mb-2 font-medium">
            CEFR Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-background"
          >
            {cefrLevels.map((levelOption) => (
              <option key={levelOption} value={levelOption}>
                {levelOption}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-medium mb-4">Paragraphs</h2>

        {paragraphs.map((paragraph, index) => (
          <div key={index} className="mb-8 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Paragraph {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeParagraph(index)}
                disabled={paragraphs.length <= 1}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor={`german-${index}`} className="block mb-2">
                German Text
              </label>
              <textarea
                id={`german-${index}`}
                value={paragraph.german}
                onChange={(e) => handleParagraphChange(index, "german", e.target.value)}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md bg-background"
              />
            </div>

            <div>
              <label htmlFor={`english-${index}`} className="block mb-2">
                English Translation
              </label>
              <textarea
                id={`english-${index}`}
                value={paragraph.english}
                onChange={(e) => handleParagraphChange(index, "english", e.target.value)}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md bg-background"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addParagraph}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Add Paragraph
        </button>

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
    </main>
  );
}