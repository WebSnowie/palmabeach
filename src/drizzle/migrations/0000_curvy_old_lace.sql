CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id" varchar(6) PRIMARY KEY NOT NULL,
	"room_type" varchar(50) NOT NULL,
	"room_id" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"customer_email" varchar(100) NOT NULL,
	"customer_name" varchar(50) NOT NULL,
	"customer_surname" varchar(50) NOT NULL,
	"customer_phone" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"room_id" integer PRIMARY KEY NOT NULL,
	"room_type" varchar(50) NOT NULL,
	"price_per_night" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory_periods" (
	"id" integer PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_inventory_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."inventory"("room_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_periods" ADD CONSTRAINT "inventory_periods_room_id_inventory_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."inventory"("room_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
