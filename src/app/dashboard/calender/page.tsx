"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getRoomAvailability } from '@/server/actions/newBooking';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { FaCalendarAlt, FaBed, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const localizer = momentLocalizer(moment);

interface Booking {
    roomId: number;
    roomType: string;
    startDate: Date;
    endDate: Date;
    bookingId: string;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    customerEmail: string;
}

interface Room {
    roomId: number;
    roomType: string;
}

export default function CalendarPage() {
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [eventDetails, setEventDetails] = useState<Event | null>(null);

    const onNavigate = useCallback((newDate: Date) => setDate(newDate), []);
    const onView = useCallback((newView: any) => setView(newView), []);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBookings = await getRoomAvailability();
            const fetchedRooms = await getRoomAvailability();
            setBookings(fetchedBookings);
            setRooms(fetchedRooms);
            if (fetchedRooms.length > 0) {
                setSelectedRoom(fetchedRooms[0].roomId);
            }
        };
        fetchData();
    }, []);

    const events = bookings
        .filter(booking => booking.roomId === selectedRoom)
        .map(booking => ({
            id: booking.bookingId,
            title: `${booking.customerName} ${booking.customerSurname}`,
            start: new Date(booking.startDate),
            end: new Date(booking.endDate),
            resource: booking,
        }));

    const handleEventClick = (event: Event) => {
        setEventDetails(event);
    };

    const closeEventDetails = () => {
        setEventDetails(null);
    };

    const minDate = startOfMonth(date);
    const maxDate = endOfMonth(addMonths(date, 2));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 p-8"
        >
            <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
                Room Bookings Calendar
            </h1>
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <FaCalendarAlt className="text-2xl mr-2 text-pink-400 " />
                    <span className="text-lg font-semibold text-white">
                        {format(date, 'MMMM yyyy')}
                    </span>
                </div>
                <select
                    value={selectedRoom || ''}
                    onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    className="bg-purple-800 text-white border-2 border-pink-400 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
                >
                    {rooms.map(room => (
                        <option key={room.roomId} value={room.roomId}>
                            Room {room.roomId} - {room.roomType}
                        </option>
                    ))}
                </select>
            </div>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
            >
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    date={date}
                    view={view}
                    onNavigate={onNavigate}
                    onView={onView}
                    views={['month', 'week', 'day']}
                    onSelectEvent={handleEventClick}
                    min={minDate}
                    max={maxDate}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: '#9f7aea',
                            color: 'black', // Change the text color to black
                            borderRadius: '20px',
                            border: 'none',
                            padding: '2px 8px',
                        },
                    })}
                />
            </motion.div>

            <AnimatePresence>
                {eventDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-purple-800 to-indigo-700 p-8 rounded-2xl shadow-2xl max-w-md w-full"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-pink-400">Booking Details</h2>
                                <button
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                    onClick={closeEventDetails}
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <p className="flex items-center text-gray-200">
                                    <FaCalendarAlt className="mr-2 text-pink-400" />
                                    <span className="font-semibold">Booking ID:{' '}
                                    {eventDetails.resource.bookingId}
                                    </span>
                                </p>
                                <p className="flex items-center text-gray-200">
                                    <FaBed className="mr-2 text-pink-400" />
                                    <span className="font-semibold">Room: Room {eventDetails.resource.roomId} -{' '}
                                    {eventDetails.resource.roomType}
                                    </span>
                                </p>
                                <p className="flex items-center text-gray-200">
                                    <FaUser className="mr-2 text-pink-400" />
                                    <span className="font-semibold">Customer:{' '}
                                    {eventDetails.resource.customerName} {eventDetails.resource.customerSurname}
                                    </span>
                                </p>
                                <p className="flex items-center text-gray-200">
                                    <FaEnvelope className="mr-2 text-pink-400" />
                                    <span className="font-semibold">Email: {eventDetails.resource.customerEmail}
                                    </span>
                                </p>
                                <p className="flex items-center text-gray-200">
                                    <FaPhone className="mr-2 text-pink-400" />
                                    <span className="font-semibold">Phone: {eventDetails.resource.customerPhone}
                                    </span>
                                </p>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <div className="text-green-400 font-semibold">
                                    Check-in:{' '}
                                    {format(new Date(eventDetails.resource.startDate), 'MMM dd, yyyy')}
                                </div>
                                <div className="text-red-400 font-semibold">
                                    Check-out:{' '}
                                    {format(new Date(eventDetails.resource.endDate), 'MMM dd, yyyy')}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
