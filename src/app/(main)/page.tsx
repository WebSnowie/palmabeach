'use client';
import Image from 'next/image';
import CalendarClient from "../../app/(main)/_components/CalendarDB";
import Information from './_components/Information';
import { useEffect, useState } from 'react';
import { getCalenderDates } from '@/server/actions/newBooking';
import { CalendarRoom } from '@/types/types';

const YourComponent = () => {

  const [roomAvailability, setRoomAvailability] = useState<CalendarRoom[]>([]);
  useEffect(() => {
    const fetchRoomAvailability = async () => {
      try {
        const data = await getCalenderDates();
        setRoomAvailability(data);
      } catch (error) {
        console.error('Error fetching room availability:', error);
        setRoomAvailability([]);
      }
    };

    fetchRoomAvailability();
  }, []);

  return (
    <>
      <section className="min-h-screen flex items-center justify-start relative px-4">
        <Image src="/images/background.png" fill alt="Background image of the hotel" className="absolute inset-0 object-cover z-0" />
        <div className="relative z-9 w-full max-w-sm mt-20 ml-10">
          <CalendarClient roomAvailability={roomAvailability} /> 
        </div>
      </section>
      <section>
      <Information /> 
      </section>
    </>
  );
};

export default YourComponent;
