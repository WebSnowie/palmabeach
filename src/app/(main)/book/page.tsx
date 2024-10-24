import  {BookingShow}  from "@/server/middleware/calendar";


const YourComponent = () => {

  return (
    <>
      <section className="min-h-screen flex items-center justify-start mt-10">
            <BookingShow />
      </section>
    </>
  );
};

export default YourComponent;
