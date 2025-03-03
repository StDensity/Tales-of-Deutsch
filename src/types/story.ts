import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { stories, paragraphs, categories } from "@/db/schema";

// Type for selecting a story (matches DB row)
export type Story = InferSelectModel<typeof stories> & {
  content: Array<InferSelectModel<typeof paragraphs>>; // Add paragraphs manually
};

// Type for inserting a story
export type NewStory = InferInsertModel<typeof stories>;

// Type for selecting a paragraph
export type Paragraph = InferSelectModel<typeof paragraphs>;

// Type for inserting a paragraph
export type NewParagraph = InferInsertModel<typeof paragraphs>;

// Type for paragraph input in forms
export interface ParagraphInput {
  german: string;
  english: string;
  paragraphOrder?: number;
}

// Type for category
export type Category = InferSelectModel<typeof categories>;