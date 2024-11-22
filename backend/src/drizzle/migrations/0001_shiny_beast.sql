CREATE TABLE IF NOT EXISTS "destination" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" integer,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"activities" text,
	"photos" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trip" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(255),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"participants" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint

DROP TABLE "tour";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "destination" ADD CONSTRAINT "destination_trip_id_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
