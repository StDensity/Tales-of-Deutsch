import { db } from "@/db";
import { Place } from "@/types/place";

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
