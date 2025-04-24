CREATE TABLE "place_vocabulary" (
	"id" serial PRIMARY KEY NOT NULL,
	"german" text NOT NULL,
	"english" text NOT NULL,
	"place_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"is_community" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_entry" UNIQUE("german","english","place_id")
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"is_community" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "places_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "place_vocabulary" ADD CONSTRAINT "place_vocabulary_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;