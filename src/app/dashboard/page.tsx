"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRoomAvailability } from '@/server/actions/newBooking';
import { Booking } from '@/types/types';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [upcomingCheckouts, setUpcomingCheckouts] = useState<Booking[]>([]);
    const [alerts, setAlerts] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBookings = await getRoomAvailability();
            
            const sortedBookings = fetchedBookings.sort((a, b) => 
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );

            setRecentBookings(sortedBookings.slice(0, 10));

            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const checkouts = fetchedBookings.filter(booking => {
                const checkoutDate = new Date(booking.endDate);
                return (
                    checkoutDate.toDateString() === today.toDateString() ||
                    checkoutDate.toDateString() === tomorrow.toDateString()
                );
            });

            setUpcomingCheckouts(checkouts);
            setAlerts(['This is a sample alert message.']);
        };
        fetchData();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-900 text-white p-8"
        >
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Dashboard</h1>

            <motion.div 
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Quick Actions</h2>
                <Link href="/dashboard/bookings/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Add New Booking
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Recent Bookings</h2>
                    <ul className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        {recentBookings.map((booking, index) => (
                            <motion.li 
                                key={booking.bookingId} 
                                className="px-6 py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition duration-300 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-blue-300">
                                        {booking.customerName} {booking.customerSurname}
                                    </p>
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                                        Room {booking.roomId}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-gray-400">
                                    <p>Check-in: {new Date(booking.startDate).toLocaleDateString()}</p>
                                    <p>Check-out: {new Date(booking.endDate).toLocaleDateString()}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-red-400">Upcoming Checkouts</h2>
                    <ul className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        {upcomingCheckouts.map((checkout, index) => (
                            <motion.li 
                                key={checkout.bookingId} 
                                className="px-6 py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition duration-300 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-red-300">
                                        Room {checkout.roomId}
                                    </p>
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                                        Checkout: {new Date(checkout.endDate).toLocaleDateString()}
                                        </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">
                                    {checkout.customerName} {checkout.customerSurname}
                                </p>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-orange-400">System Alerts</h2>
                <ul className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    {alerts.map((alert, index) => (
                        <motion.li 
                            key={index} 
                            className="px-6 py-4 border-b border-gray-700 last:border-b-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <p className="text-sm text-orange-300">{alert}</p>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </motion.div>
    );
}
