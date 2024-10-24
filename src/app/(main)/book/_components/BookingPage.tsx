import CalendarBooking from "./CalendarBooking";
import { BookingPageProps } from "@/types/types";
// Define or import the Room interface

const BookingPage: React.FC<BookingPageProps> = ({ roomAvailability }) => {
    return (
        <>
            <CalendarBooking roomAvailability={roomAvailability} />
        </>
    );
};

export default BookingPage;
