"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaBed, FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { getBookingDetails, updateBooking } from '@/server/actions/newBooking';

interface BookingDetails {
  bookingId: string;
  room_id: number;
  startDate: string;
  endDate: string;
  customerEmail: string;
  customerName: string;
  customerSurname: string;
  customerPhone: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string; variants: any }> = ({ icon, label, value, variants }) => (
  <motion.div className="flex items-center" variants={variants}>
      <div className="text-blue-500 mr-4 text-xl">{icon}</div>
      <div className="flex-grow">
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="font-semibold text-gray-800">{value}</p>
      </div>
  </motion.div>
);

const EditableInfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  editValue: string;
  editSurnameValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  surnameName?: string;
  variants: any;
}> = ({ icon, label, value, isEditing, editValue, editSurnameValue, onChange, name, surnameName, variants }) => (
  <motion.div className="flex items-center" variants={variants}>
      <div className="text-blue-500 mr-4 text-xl">{icon}</div>
      <div className="flex-grow">
          <p className="text-gray-600 text-sm">{label}</p>
          {isEditing ? (
              <div className="flex space-x-2">
                  <input
                      type="text"
                      name={name}
                      value={editValue}
                      onChange={onChange}
                      className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {surnameName && (
                      <input
                          type="text"
                          name={surnameName}
                          value={editSurnameValue}
                          onChange={onChange}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                  )}
              </div>
          ) : (
              <p className="font-semibold text-gray-800">{value}</p>
          )}
      </div>
  </motion.div>
);

const BookingConfirmation: React.FC = () => {
  const params = useParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<Partial<BookingDetails>>({});
  const [emailToSend, setEmailToSend] = useState('');

  const handleSendEmail = async () => {
    if (!emailToSend) {
      setError('Please enter an email address');
      return;
    }
    try {
      // Here you would implement the actual email sending logic
      // For now, we'll just log to the console
      console.log(<code>Sending booking confirmation to ${emailToSend}</code>);
      // You might want to show a success message to the user
      alert('Booking confirmation sent successfully!');
      setEmailToSend(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send booking confirmation');
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const bookingId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      try {
        const result = await getBookingDetails(bookingId as string);
        if (result.success && result.booking) {
          setBookingDetails(result.booking);
          setEditedDetails(result.booking);
        } else {
          setError(result.error || 'Failed to fetch booking details');
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError('An unexpected error occurred');
      }
    };

    if (params.slug) {
      fetchBookingDetails();
    }
  }, [params.slug]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const result = await updateBooking({
        bookingId: bookingDetails!.bookingId,
        customerName: editedDetails.customerName,
        customerSurname: editedDetails.customerSurname,
        customerEmail: editedDetails.customerEmail,
        customerPhone: editedDetails.customerPhone,
      });
      if (result.success) {
        setBookingDetails({
          ...result.booking,
          startDate: new Date(result.booking.startDate).toISOString(),
          endDate: new Date(result.booking.endDate).toISOString(),
        });
        setIsEditing(false);
      } else {
        setError('Failed to update booking');
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setError('An unexpected error occurred while updating');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({ ...prev, [name]: value }));
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!bookingDetails) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <motion.div
            className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl w-full"
            variants={itemVariants}
        >
            <motion.div 
                className="bg-blue-600 text-white py-4 px-6 rounded-t-xl mb-6 -mx-6 -mt-6 flex justify-between items-center"
                variants={itemVariants}
            >
                <div className="flex items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold">Booking Confirmed!</h1>
                </div>
                {!isEditing && (
                    <button onClick={handleEdit} className="text-white hover:text-blue-200 transition-colors duration-300 flex flex-row gap-3 text-lg">
                        Edit information<FaEdit size={24} />
                    </button>
                )}
            </motion.div>
            <div className="flex flex-col md:flex-row md:space-x-6">
                <motion.div className="space-y-4 md:w-1/2" variants={itemVariants}>
                    <InfoItem icon={<FaCalendarAlt />} label="Booking ID" value={bookingDetails.bookingId} variants={itemVariants} />
                    <InfoItem icon={<FaBed />} label="Room ID" value={bookingDetails.room_id.toString()} variants={itemVariants} />
                    <InfoItem icon={<FaCalendarAlt />} label="Check-in" value={new Date(bookingDetails.startDate).toLocaleDateString()} variants={itemVariants} />
                    <InfoItem icon={<FaCalendarAlt />} label="Check-out" value={new Date(bookingDetails.endDate).toLocaleDateString()} variants={itemVariants} />
                </motion.div>
                <motion.div className="space-y-4 md:w-1/2 mt-4 md:mt-0" variants={itemVariants}>
                    <EditableInfoItem
                        icon={<FaUser />}
                        label="Name"
                        value={`${bookingDetails.customerName} ${bookingDetails.customerSurname}`}
                        isEditing={isEditing}
                        editValue={editedDetails.customerName || ''}
                        editSurnameValue={editedDetails.customerSurname || ''}
                        onChange={handleInputChange}
                        name="customerName"
                        surnameName="customerSurname"
                        variants={itemVariants}
                    />
                    <EditableInfoItem
                        icon={<FaEnvelope />}
                        label="Email"
                        value={bookingDetails.customerEmail}
                        isEditing={isEditing}
                        editValue={editedDetails.customerEmail || ''}
                        onChange={handleInputChange}
                        name="customerEmail"
                        variants={itemVariants}
                    />
                    <EditableInfoItem
                        icon={<FaPhone />}
                        label="Phone"
                        value={bookingDetails.customerPhone}
                        isEditing={isEditing}
                        editValue={editedDetails.customerPhone || ''}
                        onChange={handleInputChange}
                        name="customerPhone"
                        variants={itemVariants}
                    />
                    {isEditing && (
                        <motion.div className="mt-4" variants={itemVariants}>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center w-full"
                            >
                                <FaSave className="mr-2" /> Save Changes
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <motion.div className="mt-6 pt-4 border-t border-gray-200" variants={itemVariants}>
                <h2 className="text-lg font-semibold mb-2">Amenities</h2>
                <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-2">
                    <li>Free Wi-Fi</li>
                    <li>Complimentary Breakfast</li>
                    <li>24/7 Room Service</li>
                    <li>Fitness Center</li>
                </ul>
            </motion.div>

            <motion.div className="mt-6 pt-4 border-t border-gray-200" variants={itemVariants}>
                <h2 className="text-lg font-semibold mb-2">Send Booking Confirmation</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="email"
                        placeholder="Enter email address"
                        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={emailToSend}
                        onChange={(e) => setEmailToSend(e.target.value)}
                    />
                    <button
                        onClick={handleSendEmail}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    >
                        <FaPaperPlane className="mr-2" /> Send
                    </button>
                </div>
            </motion.div>
            
            <motion.div className="mt-6 text-center text-sm text-gray-500" variants={itemVariants}>
                <p>Thank you for choosing our hotel. We look forward to your stay!</p>
                <button 
                    onClick={() => window.print()} 
                    className="mt-2 text-blue-500 hover:text-blue-600 transition-colors duration-300"
                >
                    Print Confirmation
                </button>
            </motion.div>
        </motion.div>
    </motion.div>
);
};

export default BookingConfirmation;
