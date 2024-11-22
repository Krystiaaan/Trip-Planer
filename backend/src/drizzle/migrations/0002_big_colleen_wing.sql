ALTER TABLE "destination" RENAME COLUMN "photos" TO "photos[]";--> statement-breakpoint
ALTER TABLE "trip" RENAME COLUMN "image" TO "images[]";--> statement-breakpoint
ALTER TABLE "trip" ALTER COLUMN "images[]" SET DATA TYPE text;