"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/server/actions/newBooking';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

export default function AddRoomPage() {
    const router = useRouter();
    const [roomData, setRoomData] = useState({
        roomNumber: '',
        roomType: '',
        price: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoomData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createRoom({
                roomNumber: parseInt(roomData.roomNumber),
                roomType: roomData.roomType,
                price: parseFloat(roomData.price),
            });
            router.push('/dashboard/inventory');
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-8"
        >
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center text-blue-400">
                    <FaPlus className="mr-2" />
                    Add New Room
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="roomNumber" className="block mb-2 text-sm font-medium text-blue-300">Room Number:</label>
                        <input
                            type="number"
                            id="roomNumber"
                            name="roomNumber"
                            value={roomData.roomNumber}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="roomType" className="block mb-2 text-sm font-medium text-blue-300">Room Type:</label>
                        <select
                            id="roomType"
                            name="roomType"
                            value={roomData.roomType}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                            <option value="">Select a room type</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="suite">Suite</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-blue-300">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={roomData.price}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                Adding Room...
                            </div>
                        ) : (
                            <>
                                <FaPlus className="mr-2" />
                                Add Room
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
