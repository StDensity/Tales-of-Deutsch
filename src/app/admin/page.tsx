"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MapPin, BookOpen, Settings, Users } from "lucide-react";
import Link from "next/link";

// API fetch function to check admin status
const checkAdminStatus = async () => {
  const response = await fetch("/api/admin/check");
  if (!response.ok) {
    throw new Error("Failed to check admin status");
  }
  const data = await response.json();
  return data.isAdmin;
};

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Query for admin status
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: checkAdminStatus,
    enabled: isLoaded && !!user,
  });

  if (isAdminLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
        <span className="ml-3">Checking admin status...</span>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect non-admins or show access denied
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="mb-6">You do not have permission to access the admin dashboard.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary mb-8">Manage content and settings for Tales of Deutsch</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stories Management Card */}
          <Link href="/admin/stories" className="group">
            <div className="bg-card-bg rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-border hover:border-accent">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-xl font-medium">Stories Management</h2>
              </div>
              <p className="text-text-secondary mb-4">Add, edit, or remove stories for language learners.</p>
              <div className="text-accent font-medium group-hover:underline">Manage Stories →</div>
            </div>
          </Link>

          {/* Places Management Card */}
          <Link href="/admin/places" className="group">
            <div className="bg-card-bg rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-border hover:border-accent">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-xl font-medium">Places Management</h2>
              </div>
              <p className="text-text-secondary mb-4">Create and manage location-based vocabulary sets.</p>
              <div className="text-accent font-medium group-hover:underline">Manage Places →</div>
            </div>
          </Link>

          </div>
      </div>
    </main>
  );
}