export interface Room {
    roomId: number;
    roomType: string;
    bookings: Booking[];
  }
  
  export interface UpdatedRoom {
    roomId: number;
    roomType: string;
    price: number;
  }

  export interface Booking {
    bookingId: string;
    startDate: Date;
    endDate: Date;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    customerEmail: string;
}
export interface CalendarClientProps {
    roomAvailability: CalendarRoom[];
}

export interface BookingPageProps {
    roomAvailability: CalendarRoom[]; 
}

export interface CalendarProps {
    roomAvailability: CalendarRoom[];
}

export type CalendarRoom = {
  roomId: number;
  roomType: string;
  bookings: CalendarBooking[];
};

export type CalendarBooking  = {
  startDate: Date;
  endDate: Date;
};