"use client";
import React, { useEffect, useState } from 'react';
import { getRooms, deleteRoom as deleteRoomAction, updateRoom as updateRoomAction } from '@/server/actions/newBooking';
import { EditRoomModal } from './inventoryModel';
import Link from "next/link";
import { motion } from 'framer-motion';

interface Room {
    roomId: number;
    roomType: string;
    price: number;
}

export default function InventoryPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data: Room[] = await getRooms();
                setRooms(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const deleteRoom = async (roomId: number) => {
        try {
            await deleteRoomAction({ roomId });
            setRooms(rooms.filter(room => room.roomId !== roomId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = async (updatedRoom: Room) => {
        try {
            await updateRoomAction(updatedRoom);
            setRooms(rooms.map(room => 
                room.roomId === updatedRoom.roomId ? updatedRoom : room
            ));
        } catch (error) {
            console.error("Error updating room:", error);
            setError(error.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    if (error) return <div className="text-red-500 text-center text-2xl mt-10">Error: {error}</div>;

    const openEditModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedRoom(null);
        setIsModalOpen(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-900 text-white p-8"
        >
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Room Inventory</h1>
            
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-right"
            >
                <Link href="/dashboard/inventory/addroom" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 inline-block">
                    Add New Room
                </Link>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Room Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Room Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {rooms
                            .sort((a, b) => b.roomId - a.roomId)
                            .map((room, index) => (
                                <motion.tr 
                                    key={room.roomId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-300">{room.roomId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.roomType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-400">${room.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-300 ease-in-out"
                                            onClick={() => openEditModal(room)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                            onClick={() => deleteRoom(room.roomId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                    </tbody>
                </table>
            </motion.div>

            {selectedRoom && (
                <EditRoomModal 
                    room={selectedRoom}
                    onClose={closeEditModal}
                    onSave={handleEdit} 
                    isOpen={isModalOpen}
                />
            )}
        </motion.div>
    );
}
