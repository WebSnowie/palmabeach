"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import BookingModal from './_components/BookingModal';
import SurfReport from './_components/SurfReport';

const SurfCamp: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const packages = [
    { id: 1, name: 'Beginner Waves', duration: '3 days', price: 299 },
    { id: 2, name: 'Intermediate Swells', duration: '5 days', price: 499 },
    { id: 3, name: 'Advanced Barrels', duration: '7 days', price: 699 },
  ];

  const instructors = [
    { id: 1, name: 'Kelly Slater', photo: '/images/instructors/instructor1.jpg' },
    { id: 2, name: 'Bethany Hamilton', photo: '/images/instructors/instructor2.jpg' },
    { id: 3, name: 'John John Florence', photo: '/images/instructors/instructor3.jpg' },
  ];

  return (
    <div className="surf-camp">
      <motion.section 
        className="relative h-screen"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Image src="/images/backgroundSurf.jpg" alt="Surfers riding waves" layout="fill" objectFit="cover" />
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50"
          variants={slideIn}
        >
          <h1 className="text-5xl font-bold mb-4">Ride the Wave of Adventure</h1>
          <motion.button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBookingOpen(true)}
          >
            Book Your Surf Escape
          </motion.button>
        </motion.div>
      </motion.section>

      <motion.section 
        className="py-16 px-4 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Surf Paradise Awaits</h2>
          <p className="text-lg mb-6 text-gray-700">Immerse yourself in the ultimate surfing experience at our world-class camp. Whether you're a beginner catching your first wave or an experienced surfer looking to refine your skills, our expert instructors and pristine beaches provide the perfect setting for your surfing journey.</p>
          <motion.ul className="list-disc pl-6 space-y-2" variants={slideIn}>
            <li>Expert instruction for all levels</li>
            <li>State-of-the-art equipment included</li>
            <li>Beachfront accommodation</li>
            <li>Daily yoga and fitness sessions</li>
          </motion.ul>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Surf Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                variants={slideIn}
                custom={index}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.duration}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">${pkg.price}</p>
                  <motion.button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Book Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 px-4 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Surf Pros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                variants={slideIn}
                custom={index}
              >
                <Image src={instructor.photo} alt={instructor.name} width={400} height={400} objectFit="cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-center">{instructor.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Surf Spot</h2>
          <p className="text-lg mb-8 text-gray-700">Nestled along the pristine coastline of [Location], our surf camp offers access to some of the most consistent and diverse waves in the region. From gentle rollers perfect for beginners to challenging reef breaks for the advanced, our location caters to all levels of surfers.</p>
          <SurfReport />
        </div>
      </motion.section>

      <motion.section 
        className="py-16 px-4 bg-blue-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Catch Your Wave?</h2>
          <p className="text-xl mb-8">Don't miss out on the surfing adventure of a lifetime. Spots are filling up fast!</p>
          <motion.button
            className="px-8 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBookingOpen(true)}
          >
            Reserve Your Spot Now
          </motion.button>
        </div>
      </motion.section>

      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} />}
    </div>
  );
};

export default SurfCamp;
