PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_userPromotions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`user_id` text,
	`promotion_id` text NOT NULL,
	FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_userPromotions`("id", "created_at", "updated_at", "user_id", "promotion_id") SELECT "id", "created_at", "updated_at", "user_id", "promotion_id" FROM `userPromotions`;--> statement-breakpoint
DROP TABLE `userPromotions`;--> statement-breakpoint
ALTER TABLE `__new_userPromotions` RENAME TO `userPromotions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;