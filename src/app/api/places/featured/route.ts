import { NextResponse } from "next/server";
import { getAllPlaces } from "@/services/placeService";

export async function GET() {
   try {
      const places = await getAllPlaces();
      const featuredPlaces = places.slice(0, 3); // Get first 2 places
      return NextResponse.json(featuredPlaces);
   } catch (error) {
      console.error("Error fetching places:", error);
      return NextResponse.json(
         { error: "Failed to fetch places" },
         { status: 500 }
      );
   }
}
