"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

interface StoryMenuProps {
  storyId: number;
  isAuthor: boolean;
}

export default function StoryMenu({ storyId, isAuthor }: StoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleReport = () => {
    // Placeholder for report functionality
    alert("Report functionality will be implemented soon.");
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!isSignedIn || !isAuthor) return;
    
    if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      setIsDeleting(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete story");
        }
        
        // Invalidate queries and redirect
        queryClient.invalidateQueries({ queryKey: ["stories"] });
        router.push("/stories");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsDeleting(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-accent/10 transition-colors"
        aria-label="Story options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg z-10 border border-accent/20">
          <div className="py-1">
            <button
              onClick={handleReport}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Report Story
            </button>
            
            <button
              onClick={handleDelete}
              disabled={!isAuthor || isDeleting}
              className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                isAuthor
                  ? "text-red-600 hover:bg-accent/10"
                  : "text-text-secondary cursor-not-allowed"
              } transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 mr-2 ${isAuthor ? "text-red-600" : "text-text-secondary"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {isDeleting ? "Deleting..." : "Delete Story"}
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute right-0 mt-2 w-64 bg-red-100 text-red-800 p-3 rounded-md shadow-lg z-10 border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}