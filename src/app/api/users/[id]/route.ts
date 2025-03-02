import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
// import { clerkClient } from "@clerk/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  
    // Get the user from Clerk
    const clerk = await clerkClient()

    const user = await clerk.users.getUser(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return only the necessary user information
    return NextResponse.json({
      id: user.id,
      username: user.username,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}