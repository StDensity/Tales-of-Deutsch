import { places, placeVocabulary } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

// To get types for selecting
export type Place = InferSelectModel<typeof places>;
export type PlaceVocabulary = InferSelectModel<typeof placeVocabulary>

// To get types for inserting
export type NewPlace = InferSelectModel<typeof places>;
export type NewPlaceVocabulary = InferSelectModel<typeof placeVocabulary>;