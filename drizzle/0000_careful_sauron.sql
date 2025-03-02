CREATE TYPE "public"."level" AS ENUM('A1', 'A2', 'B1', 'B2');--> statement-breakpoint
CREATE TABLE "paragraphs" (
	"id" serial PRIMARY KEY NOT NULL,
	"story_id" integer NOT NULL,
	"german" text NOT NULL,
	"english" text NOT NULL,
	"paragraph_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"level" "level" NOT NULL,
	"user_id" text NOT NULL,
	"sent_for_delete" boolean DEFAULT false,
	"number_of_reports" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;