import { db } from "@/db";
import { places } from "@/db/schema";
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


export async function getPlaceDetailsById(id: number): Promise<Place|undefined> {
  try {
    const place = await db.query.places.findFirst({
      where: (places) => eq(places.id, id),
    });
    return place 
  } catch (error) {
    console.error(`Error fetching place name for id ${id}:`, error);
  }
}






export async function getPlacesByCommunityStatus(includeCommunity: boolean): Promise<Place[]> {
   try {
     // Fetch places with the specified community status
     const filteredPlaces = await db.query.places.findMany({
       where: eq(places.isCommunity, includeCommunity),
       orderBy: (places, { desc }) => [desc(places.createdAt)],
     });
 
     return filteredPlaces;
   } catch (error) {
     console.error(`Error fetching places with community status ${includeCommunity}:`, error);
     return [];
   }
 }