"use client";
import React, { useEffect, useState } from 'react';
import { getRoomAvailability, deleteBooking, updateBooking } from '@/server/actions/newBooking';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import { PaginationProps } from '@/types/types';
import { format, parse } from 'date-fns';
import { isWithinInterval } from 'date-fns/fp';
import "react-datepicker/dist/react-datepicker.css";


export interface Bookings {
    bookingId: string;
    roomType: string;
    startDate: Date;
    endDate: Date;
    customerName: string;
    customerSurname: string;
    customerEmail: string;
    customerPhone: string;
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
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

const getUnavailableDates = (roomType: string, currentBookingId: string): { start: Date; end: Date }[] => {
    return bookings
      .filter((booking: Bookings) => 
        (booking.roomType === roomType || booking.bookingId?.toString() === roomType) && 
        booking.bookingId !== currentBookingId
      )
      .map((booking: Bookings) => ({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate)
      }));
  };

    
    

    const isDateUnavailable = (date: Date, unavailableDates: { start: Date, end: Date }[]) => {
        return unavailableDates.some(range => 
            date >= range.start && date <= range.end
        );
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

    const checkDateConflicts = (bookingId: string, startDate: Date, endDate: Date) => {
        return bookings.some(booking => 
            booking.bookingId !== bookingId &&
            booking.roomType === editingBooking?.roomType &&
            new Date(booking.startDate) < new Date(endDate) &&
            new Date(booking.endDate) > new Date(startDate)
        );
    };

    const handleSave = async () => {
        if (editingBooking) {
            if (new Date(editingBooking.startDate) >= new Date(editingBooking.endDate)) {
                setError('Start date must be before end date');
                return;
            }
            if (checkDateConflicts(editingBooking.bookingId, new Date(editingBooking.startDate), new Date(editingBooking.endDate))) {
                setError('These dates conflict with an existing booking');
                return;
            }
            try {
                await updateBooking(editingBooking);
                setIsEditModalOpen(false);
                await fetchBookings();
            } catch (err) {
                setError('Failed to update booking');
            }
        }
    };

    const isDateRangeValid = (start: Date, end: Date, unavailableDates: { start: Date, end: Date }[]) => {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (isDateUnavailable(d, unavailableDates)) {
                return false;
            }
        }
        return true;
    };

    const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
        if (editingBooking && date) {
            const unavailableDates = getUnavailableDates(editingBooking.roomType, editingBooking.bookingId);
            const otherField = field === 'startDate' ? 'endDate' : 'startDate';
            const otherDate = editingBooking[otherField];
    
            if (field === 'startDate' && date > otherDate) {
                setEditingBooking({
                    ...editingBooking,
                    startDate: date,
                    endDate: date
                });
            } else if (field === 'endDate' && date < otherDate) {
                setEditingBooking({
                    ...editingBooking,
                    startDate: date,
                    endDate: date
                });
            } else {
                const newStartDate = field === 'startDate' ? date : editingBooking.startDate;
                const newEndDate = field === 'endDate' ? date : editingBooking.endDate;
    
                if (!isDateRangeValid(newStartDate, newEndDate, unavailableDates)) {
                    setError('Selected date range includes unavailable dates');
                    return;
                }
    
                setEditingBooking({
                    ...editingBooking,
                    [field]: date
                });
            }
        }
    };
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingBooking) {
            const value = e.target.type === 'date' 
                ? new Date(e.target.value).toISOString() 
                : e.target.value;
            setEditingBooking({
                ...editingBooking,
                [e.target.name]: value,
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
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full"
      >
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Edit Booking</h2>
        <div className="space-y-3">
          <input
            type="text"
            name="customerName"
            value={editingBooking.customerName}
            onChange={handleInputChange}
            className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
            placeholder="Customer Name"
          />
          <input
            type="text"
            name="customerSurname"
            value={editingBooking.customerSurname}
            onChange={handleInputChange}
            className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
            placeholder="Customer Surname"
          />
          <input
            type="email"
            name="customerEmail"
            value={editingBooking.customerEmail}
            onChange={handleInputChange}
            className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
            placeholder="Customer Email"
          />
          <input
            type="tel"
            name="customerPhone"
            value={editingBooking.customerPhone}
            onChange={handleInputChange}
            className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
            placeholder="Customer Phone"
          />
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
              <DatePicker
                selected={editingBooking.startDate}
                onChange={(date: Date | null) => handleDateChange('startDate', date)}
                selectsStart
                startDate={new Date(editingBooking.startDate)}
                endDate={new Date(editingBooking.endDate)}
                minDate={new Date()}
                excludeDates={getUnavailableDates(editingBooking.roomType, editingBooking.bookingId).map(range => range.start)}
                filterDate={date => !isDateUnavailable(date, getUnavailableDates(editingBooking.roomType, editingBooking.bookingId))}
                className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
              <DatePicker
                selected={editingBooking.endDate}
                onChange={(date: Date | null) => handleDateChange('endDate', date)}
                selectsEnd
                startDate={new Date(editingBooking.startDate)}
                endDate={new Date(editingBooking.endDate)}
                minDate={new Date(editingBooking.startDate)}
                excludeDates={getUnavailableDates(editingBooking.roomType, editingBooking.bookingId).map(range => range.start)}
                filterDate={date => !isDateUnavailable(date, getUnavailableDates(editingBooking.roomType, editingBooking.bookingId))}
                className="w-full p-2 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-2 px-4 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



        </motion.div>
    );
}
