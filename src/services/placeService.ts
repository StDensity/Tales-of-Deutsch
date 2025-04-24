import { db } from "@/db";
import { Place, PlaceVocabulary } from "@/types/place";
import { eq } from "drizzle-orm";

export async function getAllPlaces(): Promise<Place[]> {
   try {
      const allPlaces = await db.query.places.findMany({
         orderBy: (places, { desc }) => [desc(places.createdAt)],
      });
      return allPlaces;
   } catch (error) {
      console.error("Error fetching places:", error);
      return [];
   }
}

export async function getPlaceVocabulary(
   id: number
): Promise<PlaceVocabulary[]> {
   try {
      const placeVocabularies = await db.query.placeVocabulary.findMany({
         where: (placeVocabulary) => eq(placeVocabulary.placeId, id),
      });
      return placeVocabularies; // Assuming you want the first vocabulary entry for the place
   } catch (error) {
      console.error(`Error fetching place vocabulary for id ${id}:`, error);
      return [];
   }
}


export async function getPlaceNameById(id: number): Promise<string> {
  try {
    const place = await db.query.places.findFirst({
      where: (places) => eq(places.id, id),
    });
    return place?.name || ""
  } catch (error) {
    console.error(`Error fetching place name for id ${id}:`, error);
    return ""; 
  }
}