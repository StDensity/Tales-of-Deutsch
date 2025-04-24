import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { places, placeVocabulary } from "@/db/schema";

export async function POST(request: Request) {
   try {
      // Get the current user
      const user = await currentUser();

      // Check if user is authenticated
      if (!user) {
         return NextResponse.json(
            { error: "You must be signed in to contribute" },
            { status: 401 }
         );
      }

      const body = await request.json();
      const { placeName, vocabularyList } = body;

      // Validate required fields
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

      // Limit the number of vocabulary items to prevent abuse
      if (vocabularyList.length > 50) {
         return NextResponse.json(
            { error: "Maximum of 50 vocabulary items allowed per place" },
            { status: 400 }
         );
      }

      // Insert the new place into the database
      const [newPlace] = await db
         .insert(places)
         .values({
            name: placeName,
            userId: user.id,
            isCommunity: true,
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
         isCommunity: true,
         isApproved: false, // Community vocabulary needs approval
      }));

      await db.insert(placeVocabulary).values(vocabularyItems);

      // Return success response with the created place
      return NextResponse.json({
         success: true,
         message:
            "Place submitted successfully! It will be reviewed before publishing.",
         place: {
            id: newPlace.id,
            name: newPlace.name,
            vocabularyCount: vocabularyItems.length,
         },
      });
   } catch (error) {
      console.error("Error creating community place:", error);
      return NextResponse.json(
         { error: "Failed to submit place" },
         { status: 500 }
      );
   }
}
