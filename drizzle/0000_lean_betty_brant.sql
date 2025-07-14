CREATE TYPE "public"."content_topic" AS ENUM('posts', 'experiences', 'contact');--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" "content_topic" NOT NULL,
	"slug" varchar(255) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "topic_slug_unique" UNIQUE("topic","slug")
);
--> statement-breakpoint
CREATE INDEX "topic_slug_idx" ON "page_views" USING btree ("topic","slug");