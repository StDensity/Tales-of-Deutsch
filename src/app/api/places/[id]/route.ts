import { getPlaceNameById, getPlaceVocabulary } from "@/services/placeService";
import { NextResponse } from "next/server";

export async function GET(
   request: Request,
   { params }: { params: Promise<{ id: number }> }
) {
   try {
      const { id } = await params;
      const placeVocabularies = await getPlaceVocabulary(id);
      const placeName = await getPlaceNameById(id);

      return NextResponse.json({
        placeName: placeName,
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
