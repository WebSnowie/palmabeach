'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import dynamic from 'next/dynamic';
import { amenities, activities} from "../book/_components/_data/data"
import Footer from './Footer';
import Image from 'next/image';

const Map = dynamic(() => import('./Map').then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});
const RoomDisplay = dynamic(() => import('../book/_components/RoomDisplay').then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading rooms...</p>
});


const Information = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

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
      <RoomDisplay />
      <Map />
     <Footer />
      </div>)}

export default Information;
