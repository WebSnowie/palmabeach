import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { rooms} from "../book/_components/_data/data"
import Image from 'next/image';


export default function RoomDisplay() {

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);    
    const router = useRouter();
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
  
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
  
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, []);
  
    useEffect(() => {
      let interval: NodeJS.Timeout | undefined;
      if (isVisible) {
        interval = setInterval(() => {
          setSelectedRoom((prev) => (prev + 1) % rooms.length);
        }, 5000); // Change room every 5 seconds
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isVisible, rooms.length]);
    
    const variants = {
      enter: (direction: number) => {
        return {
          x: direction > 0 ? 1000 : -1000,
          opacity: 0
        };
      },
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1
      },
      exit: (direction: number) => {
        return {
          zIndex: 0,
          x: direction < 0 ? 1000 : -1000,
          opacity: 0
        };
      }
    };
  
  
    const handleBookNow = () => {
      const fullRoomName = rooms[selectedRoom].name;
      const roomTypeWords = fullRoomName.split(' ');
      const roomType = roomTypeWords.slice(0, -1).join('').toLowerCase();
      router.push(`/book?roomType=${roomType}`);
    };
  
    
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };
  


    return (              
        <section ref={sectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors duration-300 ${selectedRoom === index ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setSelectedRoom(index)}
                >
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <p className="text-gray-600">{room.size} - {room.price}</p>
                </motion.div>
              ))}
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <AnimatePresence initial={false} custom={selectedRoom}>
                <motion.div
                  key={selectedRoom}
                  custom={selectedRoom}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      setSelectedRoom((prev) => (prev + 1) % rooms.length);
                    } else if (swipe > swipeConfidenceThreshold) {
                      setSelectedRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
                    }
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={rooms[selectedRoom].image}
                    alt={rooms[selectedRoom].name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-end">
                    <h3 className="text-2xl font-semibold mb-2 text-white">{rooms[selectedRoom].name}</h3>
                    <p className="text-white mb-4">{rooms[selectedRoom].description}</p>
                    <ul className="text-white mb-4">
                      {rooms[selectedRoom].amenities.map((amenity, index) => (
                        <li key={index} className="inline-block mr-4 mb-2">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleBookNow} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>)
}