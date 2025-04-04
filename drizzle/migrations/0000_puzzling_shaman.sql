CREATE TABLE `history` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`user_id` text,
	`description` text,
	`points` text,
	`pointsBefore` integer,
	`pointsAfter` integer
);
--> statement-breakpoint
CREATE TABLE `promotionsCategory` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`is_multiplier` integer DEFAULT false NOT NULL,
	`amount` integer
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`title` text,
	`description` text,
	`start_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`end_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`promotion_category_id` text NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`promotion_category_id`) REFERENCES `promotionsCategory`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `userBalance` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`user_id` text,
	`amount` text,
	`is_premium` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `userPromotions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`user_id` text,
	`promotion_id` text NOT NULL,
	FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON UPDATE no action ON DELETE no action
);
