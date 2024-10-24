import { motion } from 'framer-motion';
import Image from 'next/image';

interface RoomOption {
    id: string;
    label: string;
    description: string;
    image: string;
    price: number;
}

interface RoomSelectionProps {
    roomType: string;
    setRoomType: (type: string) => void;
    startDate?: Date;
    endDate?: Date;
}

const roomOptions: RoomOption[] = [
    { 
        id: 'single', 
        label: 'Single Room', 
        description: 'A cozy room for one person.', 
        image: "/images/Picture1.jpeg",
        price: 100 
    },
    { 
        id: 'double', 
        label: 'Double Room', 
        description: 'A comfortable room for two.', 
        image: "/images/Picture1.jpeg",
        price: 150 
    },
    { 
        id: 'deluxe', 
        label: 'Deluxe Room', 
        description: 'An upgraded room with premium features.', 
        image: "/images/Picture1.jpeg",
        price: 200 
    },
    { 
        id: 'suite', 
        label: 'Suite', 
        description: 'A luxurious suite with extra amenities.', 
        image: "/images/Picture1.jpeg",
        price: 250 
    }
];

// Motion Variants
const cardContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.5, 
            ease: "easeOut", 
            staggerChildren: 0.2  // Animates each card with a slight delay
        } 
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.4, ease: "easeOut" }
    },
    click: { 
        scale: 1.03, 
        transition: { type: 'spring', stiffness: 400, damping: 15 }
    }
};

const RoomSelection: React.FC<RoomSelectionProps> = ({ roomType, setRoomType, startDate, endDate }) => {
    // Calculate number of nights
    const calculateNights = (): number => {
        if (startDate && endDate) {
            return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    // Calculate total price
    const calculateTotalPrice = (basePrice: number): number => {
        const nights = calculateNights();
        return nights * basePrice;
    };

    return (
        <div className="flex justify-center items-center w-full">
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
            >
                {roomOptions.map((room) => (
                    <motion.div 
                        key={room.id} 
                        className={`flex flex-col bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer shadow-md
                                    ${roomType === room.id ? 'border-blue-600 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setRoomType(room.id)}
                        variants={cardVariants}
                        whileTap="click"
                    >
                        <div className="relative">
                            <Image 
                                src={room.image} 
                                width={250} 
                                height={150} 
                                alt={room.label} 
                                className="w-full h-auto"
                            />
                            {/* Base price tag */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                ${room.price}/night
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="text-center mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{room.label}</h3>
                                <p className="text-sm text-gray-600">{room.description}</p>
                            </div>

                            {/* Show total price when dates are selected */}
                            {startDate && endDate && (
                                <div className="mt-2 text-center">
                                    <div className="text-sm text-gray-600">
                                        {calculateNights()} nights
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">
                                        Total: ${calculateTotalPrice(room.price)}
                                    </div>
                                </div>
                            )}

                            {/* Selected indicator */}
                            {roomType === room.id && (
                                <div className="mt-2 text-center text-blue-600 font-medium">
                                    ✓ Selected
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default RoomSelection;
