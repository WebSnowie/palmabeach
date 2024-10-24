"use server";
import { z } from 'zod';
import { db } from '@/drizzle/db';
import { inventory, bookings, inventoryPeriods } from '@/drizzle/schema';
import { sql, and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Room, UpdatedRoom } from '@/types/types';

// Schema for validating booking form data
const BookingFormSchema = z.object({
    startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid start date',
    }),
    endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid end date',
    }),
    roomType: z.string(),
    name: z.string().min(1).max(50),
    surname: z.string().min(1).max(50),
    email: z.string().email().max(100),
    phone: z.string().min(10).max(20),
});


export async function deleteBooking(bookingId: string) {
    try {
        // Delete from inventory_periods table
        const inventoryDeleteResult = await db.delete(inventoryPeriods)
            .where(eq(inventoryPeriods.bookingId, bookingId))
            .execute();

        // Delete from bookings table
        const bookingDeleteResult = await db.delete(bookings)
            .where(eq(bookings.bookingId, bookingId))
            .execute();

        // Check if any rows were affected in either table
        if (inventoryDeleteResult.rowCount === 0 && bookingDeleteResult.rowCount === 0) {
            return {
                success: false,
                message: 'Booking not found in either table'
            };
        }

        return { 
            success: true, 
            message: `Booking deleted successfully. Inventory period ${inventoryDeleteResult.rowCount > 0 ? 'was' : 'was not'} deleted.`
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete booking',
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

export async function updateBooking(booking: {
    bookingId: string;
    roomType?: string;
    startDate?: Date;
    endDate?: Date;
    customerName?: string;
    customerSurname?: string;
    customerEmail?: string;
    customerPhone?: string;
}) {
    try {
        const { bookingId, ...updateData } = booking;

        await db.update(bookings)
            .set(updateData)
            .where(eq(bookings.bookingId, bookingId))
            .execute();

        // Fetch the updated booking
        const updatedBooking = await db.select()
            .from(bookings)
            .where(eq(bookings.bookingId, bookingId))
            .execute();

        if (updatedBooking.length === 0) {
            throw new Error('Booking not found or failed to retrieve updated booking');
        }

        return { success: true, booking: updatedBooking[0] };
    } catch (error) {
        console.error('Error updating booking:', error);
        throw new Error('Failed to update booking');
    }
}


export async function getCalenderDates() {
    try {
        const results = await db
            .select({
                roomId: inventory.room_id,
                roomType: inventory.room_type,
                bookingId: bookings.bookingId,
                startDate: bookings.startDate,
                endDate: bookings.endDate,
                customerName: bookings.customerName,
                customerSurname: bookings.customerSurname,
                customerPhone: bookings.customerPhone,
                customerEmail: bookings.customerEmail,
            })
            .from(bookings)
            .leftJoin(inventory, sql`${bookings.room_id} = ${inventory.room_id}`) // Use sql for comparison
            .execute();

        const roomMap = new Map<string, Room>();

        results.forEach(result => {
            const key = `${result.roomId}-${result.roomType}`;
            if (!roomMap.has(key)) {
                roomMap.set(key, {
                    roomId: result.roomId!, 
                    roomType: result.roomType!, 
                    bookings: [],
                });
            }

            if (result.startDate && result.endDate) {
                roomMap.get(key)?.bookings.push({
                    bookingId: result.bookingId,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    customerName: result.customerName,
                    customerSurname: result.customerSurname,
                    customerPhone: result.customerPhone,
                    customerEmail: result.customerEmail,
                });
            }
        });

        return Array.from(roomMap.values());
    } catch (error) {
        console.error("Error fetching room availability:", error);
        throw new Error("Database query failed");
    }
}

// Function to get all rooms from the inventory
export async function getRooms() {
    try {
        const rooms = await db
            .select({
                roomId: inventory.room_id,
                roomType: inventory.room_type, 
                price: inventory.price_per_night,
            })
            .from(inventory)
            .execute();
        
        return rooms;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw new Error("Database query failed");
    }
}

export async function createRoom({ roomNumber, roomType, price }: { roomNumber: number; roomType: string; price: number }) {
    try {
        await db.insert(inventory).values({
            room_id: roomNumber,
            room_type: roomType,
            price_per_night: price,
        }).execute();

        return { success: true, message: 'Room created successfully' };
    } catch (error) {
        console.error('Error creating room:', error);
        throw new Error('Failed to create room');
    }
}




export async function updateRoomAction(updatedRoom: UpdatedRoom) {
    try {
        const result = await updateRoom(updatedRoom);
        if (result.success) {
            return { success: true };
        } else {
            throw new Error('Update was not successful');
        }
    } catch (error) {
        console.error("Error in updateRoomAction:", error);
        throw new Error("Failed to update room");
    }
}

// Function to update a room by ID


export async function updateRoom(updatedRoom: UpdatedRoom) {
    if (!updatedRoom) {
        throw new Error("updatedRoom is undefined");
    }

    try {
        await db
            .update(inventory)
            .set({
                room_type: updatedRoom.roomType,
                price_per_night: updatedRoom.price,
            })
            .where(eq(inventory.room_id, updatedRoom.roomId))
            .execute();

        return { success: true };
    } catch (error) {
        console.error("Error updating room:", error);
        throw new Error("Failed to update room");
    }
}

export async function deleteRoomAction({ roomId }: { roomId: number }) {
    try {
        return await deleteRoom({ roomId }); // Assuming deleteRoom is the function handling the actual delete logic
    } catch (error) {
        console.error("Error in deleteRoomAction:", error);
        throw error; // Propagate the error to the calling function
    }
}





export async function deleteRoom({ roomId }: { roomId: number }) {
    try {
        await db.delete(inventoryPeriods).where(eq(inventoryPeriods.room_id, roomId)).execute();
        await db.delete(bookings).where(eq(bookings.room_id, roomId)).execute();
        await db.delete(inventory).where(eq(inventory.room_id, roomId)).execute();

        return { success: true };
    } catch (error) {
        console.error("Error deleting room:", error);
        throw new Error("Failed to delete room and related records");
    }
}




export async function getRoomAvailability() {
    try {
        const results = await db
            .select({
                roomId: inventory.room_id,
                roomType: inventory.room_type,
                startDate: bookings.startDate,
                endDate: bookings.endDate,
                bookingId: bookings.bookingId,
                customerName: bookings.customerName,
                customerSurname: bookings.customerSurname,
                customerPhone: bookings.customerPhone,
                customerEmail: bookings.customerEmail,
            })
            .from(bookings)
            .innerJoin(inventory, sql`${bookings.room_id} = ${inventory.room_id}`) // Use sql for comparison
            .execute();

        return results;
    } catch (error) {
        console.error("Error fetching room availability:", error);
        throw new Error("Database query failed");
    }
}

// Function to check room availability
async function checkRoomAvailability(
    roomType: string,
    startDate: Date,
    endDate: Date
): Promise<number | null> {
    try {

        // Find all rooms of the specified type
        const rooms = await db
            .select({
                roomId: inventory.room_id,
            })
            .from(inventory)
            .where(eq(inventory.room_type, roomType))
            .execute();

        if (rooms.length === 0) {
            return null;
        }

        // For each room, check if it's available during the requested period
        for (const room of rooms) {
            // Get all bookings for this room that overlap with the requested period
            const conflicts = await db
                .select({
                    bookingId: bookings.bookingId,
                    existingStart: bookings.startDate,
                    existingEnd: bookings.endDate,
                    count: sql<number>`count(*)`
                })
                .from(bookings)
                .where(and(
                    eq(bookings.room_id, room.roomId),
                    sql`
                        (${bookings.startDate} < ${endDate.toISOString()} AND 
                         ${bookings.endDate} > ${startDate.toISOString()})
                    `
                ))
                .groupBy(
                    bookings.bookingId,
                    bookings.startDate,
                    bookings.endDate
                )
                .execute();

            // Check if conflicts is empty
            if (conflicts.length === 0) {
                // Check the count of conflicts
                return room.roomId;
            }
        }
        return null;
    } catch (error) {
        console.error('Error in checkRoomAvailability:', error);
        throw new Error(`Failed to check room availability: ${error.message}`);
    }
}

// Function to create a new booking
export async function createBooking(formData: FormData) {
    try {
        // Parse and validate the form data
        const validatedData = BookingFormSchema.parse({
            startDate: formData.get('checkInDate'),
            endDate: formData.get('checkOutDate'),
            roomType: formData.get('roomType'),
            name: formData.get('name'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
        });

        const startDate = new Date(validatedData.startDate);
        const endDate = new Date(validatedData.endDate);

        // Additional date validation
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Check if dates are valid
        if (startDate >= endDate) {
            throw new Error('End date must be after start date');
        }

        // Check if start date is not in the past
        if (startDate < new Date()) {
            throw new Error('Start date cannot be in the past');
        }

        // Check room availability
        const availableRoomId = await checkRoomAvailability(
            validatedData.roomType,
            startDate,
            endDate
        );

        if (!availableRoomId) {
            throw new Error(`No rooms available for room type "${validatedData.roomType}" between ${startDate.toISOString()} and ${endDate.toISOString()}`);
        }

        // Generate booking ID
        const bookingId = generateBookingId();

        // Start a transaction
        await db.insert(bookings).values({
            bookingId, // Primary key
            room_id: availableRoomId, // Room ID
            startDate, // Start date
            endDate, // End date
            customerEmail: validatedData.email, // Customer email
            customerName: validatedData.name, // Customer name
            customerSurname: validatedData.surname, // Customer surname
            customerPhone: validatedData.phone, // Customer phone
        }).execute();

        // Create an entry in the inventory periods
        await db.insert(inventoryPeriods).values({
            bookingId, // Foreign key referencing the booking
            room_id: availableRoomId, // Room ID
            start: startDate, // Start date
            end: endDate, // End date
        }).execute();


        // Revalidate the page to update the UI
        revalidatePath('/');

        return { success: true, bookingId };
    } catch (error) {
        console.error('Error creating booking:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid form data', details: error.errors };
        }
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

// Generate a random 6-character booking ID
const generateBookingId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};