import Image from 'next/image';
import CalendarShow from '@/server/middleware/calendar'; // Adjust path as needed
import Information from './book/_components/Information';

const YourComponent = () => {
  return (
    <>
      <section className="min-h-screen flex items-center justify-start relative px-4">
        <Image src="/images/background.png" fill alt="Background image of the hotel" className="absolute inset-0 object-cover z-0" />
        <div className="relative z-9 w-full max-w-sm mt-20 ml-10">
          <CalendarShow /> {/* No onSubmit prop needed */}
        </div>
      </section>
      <section>
      <Information /> 
      </section>
    </>
  );
};

export default YourComponent;
