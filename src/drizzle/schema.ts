import { relations } from 'drizzle-orm';
import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

// Define the inventory table
export const inventory = pgTable('inventory', {
    room_id: integer('room_id').primaryKey().notNull(),
    room_type: varchar('room_type', { length: 50 }).notNull(),
    price_per_night: integer('price_per_night').notNull(),
});

// Define the bookings table schema
export const bookings = pgTable('bookings', {
    bookingId: varchar('booking_id', { length: 6 }).primaryKey().notNull(), // Booking ID as primary key
    room_id: integer('room_id')
        .notNull()
        .references(() => inventory.room_id), // Foreign key referencing inventory
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    customerEmail: varchar('customer_email', { length: 100 }).notNull(),
    customerName: varchar('customer_name', { length: 50 }).notNull(),
    customerSurname: varchar('customer_surname', { length: 50 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
});

// Define the inventory periods table
export const inventoryPeriods = pgTable('inventory_periods', {
    bookingId: varchar('booking_id', { length: 6 })
        .notNull()
        .references(() => bookings.bookingId), // Foreign key referencing bookings
    room_id: integer('room_id')
        .notNull()
        .references(() => inventory.room_id), // Foreign key referencing inventory
    start: timestamp('start', { withTimezone: true }).notNull(),
    end: timestamp('end', { withTimezone: true }).notNull(),
});

// Define relations for inventory
export const inventoryRelations = relations(inventory, ({ one }) => ({
    periods: one(inventoryPeriods, {
        fields: [inventory.room_id],
        references: [inventoryPeriods.room_id],
    }),
}));

// Define relations for bookings
export const bookingRelations = relations(bookings, ({ one }) => ({
    inventoryPeriods: one(inventoryPeriods, {
        fields: [bookings.bookingId],
        references: [inventoryPeriods.bookingId],
    }),
}));
