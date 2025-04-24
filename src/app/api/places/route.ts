import { NextResponse } from "next/server";
import { getAllPlaces } from "@/services/placeService";

export async function GET() {
   try {
      const places = await getAllPlaces();
      return NextResponse.json(places);
   } catch (error) {
      console.error("Error fetching places:", error);
      return NextResponse.json(
         { error: "Failed to fetch places" },
         { status: 500 }
      );
   }
}
