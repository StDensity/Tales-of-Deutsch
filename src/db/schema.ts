import {
   pgTable,
   serial,
   text,
   boolean,
   integer,
   timestamp,
   pgEnum,
   unique,
} from "drizzle-orm/pg-core";
import { is, relations, sql } from "drizzle-orm";

export const cefrLevelEnum = pgEnum("level", ["A1", "A2", "B1", "B2"]);

export const stories = pgTable("stories", {
   id: serial("id").primaryKey(),
   title: text("title").notNull(),
   level: cefrLevelEnum("level").notNull(),
   userId: text("user_id").notNull(),
   sentForDelete: boolean("sent_for_delete").default(false),
   numberOfReports: integer("number_of_reports").default(0),
   isCommunity: boolean("is_community").notNull().default(true),
   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const paragraphs = pgTable("paragraphs", {
   id: serial("id").primaryKey(),
   storyId: integer("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
   german: text("german").notNull(),
   english: text("english").notNull(),
   paragraphOrder: integer("paragraph_order").notNull(),
});

export const categories = pgTable("categories", {
   id: serial("id").primaryKey(),
   name: text("name").notNull().unique(), // e.g., "Adventure", "Romance"
});

// Junction table for stories and categories (many-to-many)
export const storyCategories = pgTable("story_categories", {
   storyId: integer("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
   categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
});

export const storiesRelations = relations(stories, ({ many }) => ({
   paragraphs: many(paragraphs),
}));

export const paragraphsRelations = relations(paragraphs, ({ one }) => ({
   story: one(stories, {
      fields: [paragraphs.storyId],
      references: [stories.id],
   }),
}));

export const storyCategoriesRelations = relations(
   storyCategories,
   ({ one }) => ({
      story: one(stories, {
         fields: [storyCategories.storyId],
         references: [stories.id],
      }),
      category: one(categories, {
         fields: [storyCategories.categoryId],
         references: [categories.id],
      }),
   })
);

// Table for palaces
export const places = pgTable("places", {
   id: serial("id").primaryKey(),
   name: text("name").notNull().unique(),
   userId: text("user_id").notNull(),
   isCommunity: boolean("is_community").notNull().default(true),
   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Vocabulary table for the place
export const placeVocabulary = pgTable(
   "place_vocabulary",
   {
      id: serial("id").primaryKey(),
      german: text("german").notNull(),
      english: text("english").notNull(),
      placeId: integer("place_id")
         .notNull()
         .references(() => places.id, { onDelete: "cascade" }),
      userId: text("user_id").notNull(),
      isCommunity: boolean("is_community").notNull().default(true),
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
   },
   (table) => [
      unique("unique_entry").on(table.german, table.english, table.placeId),
   ]
);

export const placesRelations = relations(places, ({ many }) => ({
   placeVocabulary: many(placeVocabulary),
}));

export const placeVocabularyRelations = relations(
   placeVocabulary,
   ({ one }) => ({
      place: one(places, {
         fields: [placeVocabulary.placeId],
         references: [places.id],
      }),
   })
);
