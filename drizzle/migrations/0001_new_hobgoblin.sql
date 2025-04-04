DROP TABLE `promotionsCategory`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_promotions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`title` text,
	`description` text,
	`start_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`end_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`promotion_category_type` text,
	`is_premium` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_promotions`("id", "created_at", "updated_at", "title", "description", "start_date", "end_date", "promotion_category_type", "is_premium") SELECT "id", "created_at", "updated_at", "title", "description", "start_date", "end_date", "promotion_category_type", "is_premium" FROM `promotions`;--> statement-breakpoint
DROP TABLE `promotions`;--> statement-breakpoint
ALTER TABLE `__new_promotions` RENAME TO `promotions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;