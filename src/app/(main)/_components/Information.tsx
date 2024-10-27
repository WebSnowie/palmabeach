'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import dynamic from 'next/dynamic';
import {rooms, amenities, activities} from "../book/_components/_data/data"
import { useRouter } from 'next/navigation';



const Map = dynamic(() => import('./Map').then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});


const Information = () => {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
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
  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set(prev).add(imageSrc));
  };


  return (
    <div className="bg-gray-100">
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold mb-8 text-center text-gray-800"
          >
            Welcome to Our Luxury Resort in Kuta Lombok
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Experience unparalleled luxury and comfort in the heart of Kuta Lombok. Our resort offers stunning views, 
            world-class amenities, and exceptional service to make your stay truly unforgettable.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8"
          >
            <Image 
              src="/images/information.jpg" 
              width={1200} 
              height={400} 
              alt="Featured resort image" 
              className={`rounded-lg shadow-2xl mx-auto ${loadedImages.has('/images/information.jpg') ? '' : 'blur-sm'}`}
              onLoad={() => handleImageLoad('/images/information.jpg')}
            />
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Resort Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center bg-gray-100 rounded-lg p-4"
              >
                <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{amenity} </span>
              </motion.div>
            ))}
            
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Activities and Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative h-96 rounded-lg shadow-lg overflow-hidden group"
              >
                <LazyLoadImage
                  src={activity.image}
                  alt={activity.name}
                  effect="blur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-semibold mb-2 text-white">{activity.name}</h3>
                  <p className="text-white">{activity.description}</p>
                </div>
              </motion.div>
            ))}
            </div>
        </div>
      </section>
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
      </section>
      <Map />
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Luxury Resort Kuta Lombok</h3>
              <p className="text-sm">Experience paradise on Earth</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-md font-semibold mb-2">Quick Links</h4>
              <ul className="text-sm">
                <li><a href="#" className="hover:text-gray-300">Home</a></li>
                <li><a href="#" className="hover:text-gray-300">Rooms</a></li>
                <li><a href="#" className="hover:text-gray-300">Amenities</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-md font-semibold mb-2">Contact Us</h4>
              <p className="text-sm">123 Beach Road, Kuta, Lombok, Indonesia</p>
              <p className="text-sm">Phone: +62 123 456 7890</p>
              <p className="text-sm">Email: info@luxuryresortkutalombok.com</p>
            </div>
            <div className="w-full md:w-1/4">
              <h4 className="text-md font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2023 Luxury Resort Kuta Lombok. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>)}

export default Information;
