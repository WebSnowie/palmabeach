import React, { useState, useEffect } from "react";



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


export function EditRoomModal({ room, onClose, onSave, isOpen } : EditRoomModalProps) {
    const [formData, setFormData] = useState({
        roomId: '',
        roomType: '',
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
            roomId: '',
            roomType: '',
            price: 0,
          });
        }
      }, [room]);
    
      if (!isOpen) return null;


    const roomTypes = ['Single', 'Double', 'Deluxe', 'Suite']; // Available room types

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl mb-4">Edit Room</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="roomType">Room Type:</label>
                    <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required
                    >
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </form>
                <button onClick={onClose} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );
}
