import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { places, placeVocabulary } from "@/db/schema";

export async function POST(request: Request) {
   try {
      const user = await currentUser();
      const adminId = process.env.ADMIN_CLERK_USER_ID;

      if (!user || user.id !== adminId) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { placeName, vocabularyList } = body;

      if (
         !placeName ||
         !Array.isArray(vocabularyList) ||
         vocabularyList.length === 0
      ) {
         return NextResponse.json(
            { error: "Invalid input data" },
            { status: 400 }
         );
      }

      // Validate that no vocabulary words or translations are empty strings
      const hasEmptyStrings = vocabularyList.some(
         (vocab: any) => 
            !vocab.german || 
            vocab.german.trim() === "" || 
            !vocab.english || 
            vocab.english.trim() === ""
      );

      if (hasEmptyStrings) {
         return NextResponse.json(
            { error: "Vocabulary words and translations cannot be empty" },
            { status: 400 }
         );
      }

      // Insert the new place into the database
      const [newPlace] = await db
         .insert(places)
         .values({
            name: placeName,
            userId: user.id,
            isCommunity: true, // Admin-created places are community by default
         })
         .returning();

      if (!newPlace) {
         return NextResponse.json(
            { error: "Failed to create place" },
            { status: 500 }
         );
      }

      // Insert all vocabulary items for this place
      const vocabularyItems = vocabularyList.map((vocab: any) => ({
         german: vocab.german.trim(),
         english: vocab.english.trim(),
         placeId: newPlace.id,
         userId: user.id,
         isCommunity: true, // Admin-created vocabulary is community by default
      }));

      await db.insert(placeVocabulary).values(vocabularyItems);

      // Return success response with the created place
      return NextResponse.json({
         success: true,
         place: {
            id: newPlace.id,
            name: newPlace.name,
            vocabularyCount: vocabularyItems.length,
         },
      });
   } catch (error) {
      console.error("Error creating place:", error);
      return NextResponse.json(
         { error: "Failed to create place" },
         { status: 500 }
      );
   }
}
