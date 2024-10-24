'use client';
import { useState, useEffect } from 'react';
import { getCalenderDates } from '@/server/actions/newBooking';
import { CalendarRoom } from '@/types/types';
import BookingPage from "./_components/BookingPage"

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

  console.log(roomAvailability);
  
  return (
    <>
      <section className="min-h-screen flex items-center justify-start mt-10">
        <BookingPage roomAvailability={roomAvailability}/>
      </section>
    </>
  );
};

export default YourComponent;
