import { z } from 'zod';

// Define the booking ID format
const BOOKING_ID_LENGTH = 6;

// Helper function to generate a random booking ID
export const generateBookingId = () => {
    return Math.random().toString(36).substring(2, BOOKING_ID_LENGTH + 2).toUpperCase();
};

// Base schema for common validation rules
const DateStringSchema = z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
});

// Booking Schema with proper type inference
export const BookingSchema = z.object({
    bookingId: z.string().length(BOOKING_ID_LENGTH, {
        message: `Booking ID must be exactly ${BOOKING_ID_LENGTH} characters.`
    }),
    room_id: z.number().int().positive({
        message: 'Room ID must be a positive integer.'
    }),
    startDate: z.date().refine(
        (date) => date >= new Date(),
        {
            message: 'Start date must be in the future.'
        }
    ),
    endDate: z.date(),
    customerEmail: z.string()
        .email({ message: 'Invalid email address.' })
        .max(100, { message: 'Email must be at most 100 characters.' }),
    customerName: z.string()
        .min(1, { message: 'Name cannot be empty.' })
        .max(50, { message: 'Name must be at most 50 characters.' }),
    customerSurname: z.string()
        .min(1, { message: 'Surname cannot be empty.' })
        .max(50, { message: 'Surname must be at most 50 characters.' }),
    customerPhone: z.string()
        .min(10, { message: 'Phone number must be at least 10 characters.' })
        .max(20, { message: 'Phone number must be at most 20 characters.' }),
}).refine(
    (data) => {
        if (!(data.startDate instanceof Date) || !(data.endDate instanceof Date)) {
            return false;
        }
        return data.endDate > data.startDate;
    },
    {
        message: 'End date must be after the start date',
        path: ['endDate'], // This will make the error show up on the endDate field
    }
);

// Room availability schema
export const RoomAvailabilitySchema = z.object({
    room_id: z.number().int().positive(),
    room_type: z.string(),
    bookings: z.array(
        z.object({
            start: DateStringSchema,
            end: DateStringSchema,
        })
    ),
});

// Define the inferred types from the schemas
export type Booking = z.infer<typeof BookingSchema>;
export type RoomAvailability = z.infer<typeof RoomAvailabilitySchema>;