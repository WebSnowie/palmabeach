"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';  // Import Framer Motion
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams, useRouter } from 'next/navigation';
import RoomSelection from './RoomSelection';
import { createBooking } from '@/server/actions/newBooking';
import { toast } from 'sonner';
import { CalendarProps } from '@/types/types';

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const Calendar: React.FC<CalendarProps> = ({ roomAvailability }) => {
    // State management
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [roomType, setRoomType] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Hooks
    const router = useRouter();
    const searchParams = useSearchParams();

    // Date availability checking
    const isDateBooked = (date: Date) => {
        const bookingsForSelectedRoomType = roomAvailability.find(
            room => room.roomType === roomType
        )?.bookings || [];
        
        return bookingsForSelectedRoomType.some(booked => 
            date >= new Date(booked.startDate) && 
            date <= new Date(booked.endDate)
        );
    };

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

    useEffect(() => {
        if (roomAvailability.length > 0) {
            const roomTypeFromParams = searchParams.get('roomType');
            const checkInDate = searchParams.get('checkInDate');
            const checkOutDate = searchParams.get('checkOutDate');
    
            if (roomTypeFromParams) {
                setRoomType(roomTypeFromParams);
            } else {
                const tonight = new Date();
                tonight.setHours(0, 0, 0, 0);
                
                const availableRoomType = roomAvailability.find(room => 
                    isRoomTypeAvailable(tonight, room.roomType)
                )?.roomType;
    
                setRoomType(availableRoomType || roomAvailability[0].roomType);
            }
    
            if (checkInDate) setStartDate(new Date(checkInDate));
            if (checkOutDate) setEndDate(new Date(checkOutDate));
        } else {
            setRoomType('single');
        }
    }, [roomAvailability, searchParams]);

    const areDatesAvailable = (start: Date, end: Date): boolean => {
        const currentDate = new Date(start);
        while (currentDate <= end) {
            if (isDateBooked(currentDate)) {
                return false;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return true;
    };

    // Event handlers
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        
        // Prevent same-day bookings
        if (start && end && start.getTime() === end.getTime()) {
            return;
        }

        // Reset selection if there are booked dates in between
        if (start && end && !areDatesAvailable(start, end)) {
            toast.error("Selected dates are not available");
            setStartDate(undefined);
            setEndDate(undefined);
            return;
        }

        setStartDate(start ?? undefined);
        setEndDate(end ?? undefined);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!startDate || !endDate || startDate >= endDate || !areDatesAvailable(startDate, endDate)) {
            toast.error("Please select valid dates");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const formDataToSubmit = new FormData();
            formDataToSubmit.set('checkInDate', startDate.toISOString());
            formDataToSubmit.set('checkOutDate', endDate.toISOString());
            formDataToSubmit.set('roomType', roomType);
            formDataToSubmit.set('name', formData.name);
            formDataToSubmit.set('surname', formData.surname);
            formDataToSubmit.set('email', formData.email);
            formDataToSubmit.set('phone', formData.phone);

            const response = await createBooking(formDataToSubmit);

            if (response.success) {
                toast.success('Booking created successfully!');
                router.push(`/booking-confirmation/${response.bookingId}`);
            } else {
                toast.error(response.error || 'Failed to create booking');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error('Error submitting booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Price calculation (example - adjust based on your needs)
    const calculatePrice = () => {
        if (!startDate || !endDate) return null;
        
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const basePrice = roomType === 'single' ? 100 : roomType === 'double' ? 150 : 200;
        return days * basePrice;
    };

    const price = calculatePrice();

    return (
        <motion.div 
            className="flex justify-center items-center min-h-screen bg-gray-100 w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex w-full max-w-7xl gap-10 p-4">
                {/* Booking Form Section */}
                <motion.div 
                    className="flex-1 max-w-md p-6 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-center">Make Your Reservation</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Date Selection */}
                        <div className="w-full mb-6 text-center">
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                inline
                                filterDate={(date) => !isDateBooked(date)}
                                className="w-full"
                            />
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                name="name" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="First Name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <input 
                                type="text" 
                                name="surname" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Last Name" 
                                value={formData.surname} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <input 
                                type="email" 
                                name="email" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Email Address" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <input 
                                type="tel" 
                                name="phone" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Phone Number" 
                                value={formData.phone} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>

                        {/* Price Display */}
                        {price && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                <p className="text-lg font-semibold text-center">
                                    Total Price: ${price}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={
                                isSubmitting || 
                                !startDate || 
                                !endDate || 
                                startDate >= endDate || 
                                !areDatesAvailable(startDate, endDate)
                            }
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md 
                                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                                     transition duration-200 ease-in-out"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isSubmitting ? 'Processing...' : 'Book Now'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Room Selection Section */}
                <motion.div 
                    className="flex-1 p-6 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Room</h2>
                    <RoomSelection 
                        roomType={roomType} 
                        setRoomType={setRoomType}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Calendar;
