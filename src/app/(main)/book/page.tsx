import dynamic from 'next/dynamic';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const CalendarBooking = dynamic(() => import('./_components/CalendarBooking').then(mod => mod.default), {
  ssr: false,
  loading: () => <LoadingSpinner /> // Add a loading component
});

const YourComponent = () => {
    
  return (
    <>
      <section className="min-h-screen flex items-center justify-start">
        <CalendarBooking />
      </section>
    </>
  );
};

export default YourComponent;
