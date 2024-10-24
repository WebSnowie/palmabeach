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
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

const formVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  }
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
      setFormData({
        roomId: "",
        roomType: "",
        price: 0,
      });
    }
  }, [room]);

  if (!isOpen) return null;

  const roomTypes = ["Single", "Double", "Deluxe", "Suite"];

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
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
            variants={formVariants}
          >
            <motion.h2 className="text-2xl font-bold mb-4" variants={formVariants}>Edit Room</motion.h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={formVariants}>
                <label htmlFor="roomType" className="block font-medium">
                  Room Type:
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </motion.div>
              <motion.div variants={formVariants}>
                <label htmlFor="price" className="block font-medium">
                  Price:
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </motion.div>
              <motion.div className="flex justify-end space-x-4" variants={formVariants}>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
