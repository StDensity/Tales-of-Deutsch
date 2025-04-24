import { getPlaceDetailsById, getPlaceVocabulary } from "@/services/placeService";
import { NextResponse } from "next/server";

export async function GET(
   request: Request,
   { params }: { params: Promise<{ id: number }> }
) {
   try {
      const { id } = await params;
      const placeVocabularies = await getPlaceVocabulary(id);
      const placeDetails = await getPlaceDetailsById(id);
      return NextResponse.json({
      placeDetails, // Assuming you want the first vocabulary entry for the place
        vocabularies: placeVocabularies,
      });
   } catch (error) {
      console.error("Error fetching place vocabulary:", error);
      return new Response(
         JSON.stringify({ error: "Failed to fetch place vocabulary" }),
         { status: 500 }
      );
   }
}
