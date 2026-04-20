CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`institution` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `asset_classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_classes_name_unique` ON `asset_classes` (`name`);--> statement-breakpoint
CREATE TABLE `dividends` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`holding_id` integer,
	`asset_class_id` integer,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`per_share` real,
	`ex_date` integer NOT NULL,
	`payment_date` integer,
	`reinvested` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`holding_id`) REFERENCES `holdings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_class_id`) REFERENCES `asset_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `holdings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_class_id` integer,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`quantity` real DEFAULT 0 NOT NULL,
	`avg_price` real DEFAULT 0 NOT NULL,
	`current_price` real,
	`last_updated` integer,
	`created_at` integer,
	FOREIGN KEY (`asset_class_id`) REFERENCES `asset_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `portfolio_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`total_value` real NOT NULL,
	`day_change` real,
	`day_change_percent` real,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `sip_installments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sip_id` integer,
	`amount` real NOT NULL,
	`nav` real,
	`units` real,
	`date` integer NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	FOREIGN KEY (`sip_id`) REFERENCES `sips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`holding_id` integer,
	`asset_class_id` integer,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`frequency` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`last_installment_date` integer,
	`next_installment_date` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`holding_id`) REFERENCES `holdings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_class_id`) REFERENCES `asset_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`holding_id` integer,
	`asset_class_id` integer,
	`type` text NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`quantity` real NOT NULL,
	`price` real NOT NULL,
	`total_amount` real NOT NULL,
	`date` integer NOT NULL,
	`notes` text,
	`created_at` integer,
	FOREIGN KEY (`holding_id`) REFERENCES `holdings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_class_id`) REFERENCES `asset_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `watchlist_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`watchlist_id` integer,
	`asset_class_id` integer,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`added_at` integer,
	FOREIGN KEY (`watchlist_id`) REFERENCES `watchlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`asset_class_id`) REFERENCES `asset_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `watchlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer
);
