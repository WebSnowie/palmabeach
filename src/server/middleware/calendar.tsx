import { getCalenderDates } from "@/server/actions/newBooking";
import CalendarClient from "../../app/(main)/_components/CalendarDB";
import BookingPage from "@/app/(main)/book/_components/BookingPage";
import { Room } from "@/types/types"; // Make sure to import the Room type

export default async function Calendar() {
    const roomAvailability: Room[] = await getCalenderDates();

    return <CalendarClient roomAvailability={roomAvailability} />;
}

export async function BookingShow() {
    const roomAvailability: Room[] = await getCalenderDates();
    return <BookingPage roomAvailability={roomAvailability} />;
}
