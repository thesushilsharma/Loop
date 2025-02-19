CREATE TABLE "comments" (
	"comment_id" serial PRIMARY KEY NOT NULL,
	"auth_Id" text NOT NULL,
	"post_id" serial NOT NULL,
	"content" text NOT NULL,
	"votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"post_id" serial PRIMARY KEY NOT NULL,
	"auth_Id" text NOT NULL,
	"university_id" serial NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"is_up_vote" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"auth_Id" text NOT NULL,
	"university_id" serial NOT NULL,
	"rating" integer NOT NULL,
	"content" text NOT NULL,
	"votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"university_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"country" varchar(100) NOT NULL,
	"region" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"maps_url" varchar(255),
	"image_url" varchar(255),
	"website_url" varchar(255) NOT NULL,
	"linkedin_url" varchar(255),
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_Id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_Id_unique" UNIQUE("auth_Id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_auth_Id_users_auth_Id_fk" FOREIGN KEY ("auth_Id") REFERENCES "public"."users"("auth_Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_auth_Id_users_auth_Id_fk" FOREIGN KEY ("auth_Id") REFERENCES "public"."users"("auth_Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_university_id_universities_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("university_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_auth_Id_users_auth_Id_fk" FOREIGN KEY ("auth_Id") REFERENCES "public"."users"("auth_Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_university_id_universities_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("university_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_comment_idx" ON "comments" USING btree ("auth_Id");--> statement-breakpoint
CREATE INDEX "title_idx" ON "posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX "user_post_idx" ON "posts" USING btree ("auth_Id");--> statement-breakpoint
CREATE INDEX "user_review_idx" ON "reviews" USING btree ("auth_Id","university_id");--> statement-breakpoint
CREATE INDEX "auth_user_id_idx" ON "users" USING btree ("auth_Id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");