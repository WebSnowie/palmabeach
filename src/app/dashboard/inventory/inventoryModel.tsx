import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Room {
  roomId: number;
  roomType: string;
  price: number;
}

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRoom: Room) => Promise<void>;
  room?: Room;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const formVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
};

export function EditRoomModal({ room, onClose, onSave, isOpen }: EditRoomModalProps) {
  const [formData, setFormData] = useState({
    roomId: "",
    roomType: "",
    price: 0,
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomId: room.roomId.toString(),
        roomType: room.roomType,
        price: room.price,
      });
    } else {
      // Reset form when no room is provided (for creating new room)
      setFormData({
        roomId: "",
        roomType: "",
        price: 0,
      });
    }
  }, [room]);

  if (!isOpen) return null;

  const roomTypes = ["Single", "Double", "Deluxe", "Suite"]; // Available room types

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.roomType && formData.price) {
      const updatedRoom: Room = {
        ...formData,
        roomId: parseInt(formData.roomId, 10),
      };
      await onSave(updatedRoom);
      onClose();
    } else {
      console.error("Form data is incomplete", formData);
      // Handle the error, maybe show a message to the user
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          variants={formVariants}
        >
          <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="roomType" className="block font-medium">
                Room Type:
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block font-medium">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
