CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"lang" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'subscribed' NOT NULL,
	"consent_text" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"ip_hash" text,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
