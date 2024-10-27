"use client";
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter} from 'next/navigation';
import { getCalenderDates } from '@/server/actions/newBooking';
import { CalendarRoom } from '@/types/types';



const CalendarDB = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [roomType, setRoomType] = useState<string>('');
    const router = useRouter();
    
    const [roomAvailability, setRoomAvailability] = useState<CalendarRoom[]>([]);
useEffect(() => {
  const fetchRoomAvailability = async () => {
    try {
      const data = await getCalenderDates();
      setRoomAvailability(data);
    } catch (error) {
      console.error('Error fetching room availability:', error);
      setRoomAvailability([]);
    }
  };

  fetchRoomAvailability();
}, []);

    useEffect(() => {
        // Reset state on component mount or when roomAvailability changes
        if (roomAvailability.length > 0) {
            const tonight = new Date();
            tonight.setHours(0, 0, 0, 0);
    
            // Define the room type priority order
            const roomTypePriority = ['single', 'double', 'deluxe', 'suite'];
    
            // Find the first available room type based on priority
            const availableRoomType = roomTypePriority.find(type => 
                isRoomTypeAvailable(tonight, type)
            );
    
            if (availableRoomType) {
                setRoomType(availableRoomType);
            } else {
                // If no room is available, set to the first room type in the list
                setRoomType(roomAvailability[0].roomType);
            }
        }
    
    }, [roomAvailability]);
    
    const isRoomTypeAvailable = (date: Date, type: string) => {
        const room = roomAvailability.find(room => room.roomType === type);
        if (!room) return false;
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        return !room.bookings.some(booking => 
            (date >= new Date(booking.startDate) && date <= new Date(booking.endDate)) ||
            (nextDay >= new Date(booking.startDate) && nextDay <= new Date(booking.endDate))
        );
    };
    
    const isDateFullyBooked = (date: Date) => {
        const roomsOfSelectedType = roomAvailability.filter(room => room.roomType === roomType);
        const totalRoomsOfType = roomsOfSelectedType.length;
    
        const bookedRoomsCount = roomsOfSelectedType.filter(room => 
            room.bookings.some(booking => {
                const bookingStart = new Date(booking.startDate);
                const bookingEnd = new Date(booking.endDate);
                return date >= bookingStart && date <= bookingEnd;
            })
        ).length;
    
        return bookedRoomsCount >= totalRoomsOfType;
    };
    
    
    // Modified handleDateChange to automatically switch room type if necessary
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        if (start && end && start.getTime() === end.getTime()) {
            return;
        }
    
        if (start && end) {
            const currentDate = new Date(start);
            const roomTypePriority = ['single', 'double', 'deluxe', 'suite'];
            let selectedType = roomType;
    
            while (currentDate <= end) {
                if (!isRoomTypeAvailable(currentDate, selectedType)) {
                    // If current type is not available, find the first available type
                    const availableType = roomTypePriority.find(type => 
                        isRoomTypeAvailable(currentDate, type)
                    );
    
                    if (availableType) {
                        selectedType = availableType;
                    } else {
                        // No room type available for this date
                        setStartDate(undefined);
                        setEndDate(undefined);
                        return;
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            // If we've made it here, we have a valid date range and room type
            setRoomType(selectedType);
            setStartDate(start);
            setEndDate(end);
        } else {
            setStartDate(start || undefined);
            setEndDate(end || undefined);
        }
    };
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!startDate || !endDate || startDate >= endDate) {
            return;
        }

        const query = new URLSearchParams({
            checkInDate: startDate.toISOString(),
            checkOutDate: endDate.toISOString(),
            roomType,
        }).toString();

        router.push(`/book?${query}`);
    };

    const roomTypeOrder = ['single', 'double', 'deluxe', 'suite'];

    // Sort the room types based on the desired order
    const sortedRoomTypes = [...new Set(roomAvailability.map(room => room.roomType))].sort((a, b) => {
        const aIndex = roomTypeOrder.indexOf(a);
        const bIndex = roomTypeOrder.indexOf(b);
        return aIndex - bIndex;
    });
    return (
        <div className="w-[80%] mx-auto p-6 bg-white rounded-lg shadow-md opacity-97">
            <h2 className="text-2xl font-semibold mb-4 text-center">Book Your Room!</h2>
            <form onSubmit={handleSubmit} className="ml-2 w-full">
            <div className="mb-4">
                    <select
                        id="roomType"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="block w-[93%] p-2 border border-gray-300 rounded-md"
                    >
                        {sortedRoomTypes.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} Room
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full mb-4">
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        inline
                        filterDate={(date) => !isDateFullyBooked(date)}
                        className="w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="w-[93%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                    disabled={!startDate || !endDate || !roomType}
                >
                    Book Now
                </button>
            </form>
        </div>
    );
};

export default CalendarDB;

