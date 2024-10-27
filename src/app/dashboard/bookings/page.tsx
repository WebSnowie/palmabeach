"use client";
import React, { useEffect, useState } from 'react';
import { getRoomAvailability, deleteBooking, updateBooking } from '@/server/actions/newBooking';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PaginationProps, Bookings } from '@/types/types';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Bookings[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingBooking, setEditingBooking] = useState<Bookings | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(8);


    const sortBookingsByStartDate = (a: Bookings, b: Bookings) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const filteredBookings = bookings
    .filter(booking => 
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.customerName} ${booking.customerSurname}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortBookingsByStartDate);

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data: Bookings[] = await getRoomAvailability();
            const sortedData = data.sort(sortBookingsByStartDate);
            setBookings(sortedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (booking: Bookings) => {
        setEditingBooking({ ...booking });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (bookingId: string) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            try {
                await deleteBooking(bookingId);
                await fetchBookings();
            } catch (err) {
                setError('Failed to delete booking');
            }
        }
    };

    const handleSave = async () => {
        if (editingBooking) {
            try {
                await updateBooking(editingBooking);
                setIsEditModalOpen(false);
                await fetchBookings();
            } catch (err) {
                setError('Failed to update booking');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingBooking) {
            setEditingBooking({
                ...editingBooking,
                [e.target.name]: e.target.value,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-lg text-blue-400">Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-red-500 text-lg">{`Error: ${error}`}</div>
            </div>
        );
    }
    const Pagination: React.FC<PaginationProps> = ({ bookingsPerPage, totalBookings, paginate, currentPage }) => {
        const pageNumbers: number[] = [];
    
        for (let i = 1; i <= Math.ceil(totalBookings / bookingsPerPage); i++) {
            pageNumbers.push(i);
        }
        return (
            <nav className="mt-4">
                <ul className="flex justify-center">
                    {pageNumbers.map(number => (
                        <li key={number} className="mx-1">
                            <button
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };
        
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-900 text-white p-8"
        >
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Bookings</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Booking ID or Customer Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />
            </div>
            <div className="overflow-x-auto">
                <motion.table 
                    className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Booking ID</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Room Type</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Start Date</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">End Date</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Customer Name</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Customer Email</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Customer Phone</th>
                            <th className="py-3 px-4 text-left text-sm uppercase font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.map((booking, index) => (
                            <motion.tr 
                                key={booking.bookingId} 
                                className="hover:bg-gray-700 transition-colors duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <td className="py-3 px-4 border-b border-gray-700 text-blue-300">{booking.bookingId}</td>
                                <td className="py-3 px-4 border-b border-gray-700">{booking.roomType}</td>
                                <td className="py-3 px-4 border-b border-gray-700 text-green-400">{format(new Date(booking.startDate), 'MMM dd, yyyy')}</td>
                                <td className="py-3 px-4 border-b border-gray-700 text-red-400">{format(new Date(booking.endDate), 'MMM dd, yyyy')}</td>
                                <td className="py-3 px-4 border-b border-gray-700">{`${booking.customerName} ${booking.customerSurname}`}</td>
                                <td className="py-3 px-4 border-b border-gray-700">{booking.customerEmail}</td>
                                <td className="py-3 px-4 border-b border-gray-700">{booking.customerPhone}</td>
                                <td className="py-3 px-4 border-b border-gray-700">
                                    <button
                                        onClick={() => handleEdit(booking)}
                                        className="mr-2 text-blue-400 hover:text-blue-300"
                                    >
                                        <FaEdit />
</button>
<button
    onClick={() => handleDelete(booking.bookingId)}
    className="text-red-400 hover:text-red-300"
>
    <FaTrash />
</button>
</td>
</motion.tr>
))}
</tbody>
</motion.table>
</div>
<Pagination
    bookingsPerPage={bookingsPerPage}
    totalBookings={filteredBookings.length}
    paginate={paginate}
    currentPage={currentPage}
/>

<AnimatePresence>
    {isEditModalOpen && editingBooking && (
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
                className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Edit Booking</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="customerName"
                        value={editingBooking.customerName}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Customer Name"
                    />
                    <input
                        type="text"
                        name="customerSurname"
                        value={editingBooking.customerSurname}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Customer Surname"
                    />
                    <input
                        type="email"
                        name="customerEmail"
                        value={editingBooking.customerEmail}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Customer Email"
                    />
                    <input
                        type="tel"
                        name="customerPhone"
                        value={editingBooking.customerPhone}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        placeholder="Customer Phone"
                    />
                    <button
                        onClick={handleSave}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>

        </motion.div>
    );
}
