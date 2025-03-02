import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
  try {
    const user = await currentUser(); // Get authenticated user
    const adminId = process.env.ADMIN_CLERK_USER_ID;

    // Check if user is authenticated and is admin
    if (!user || user.id !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.id === adminId;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}