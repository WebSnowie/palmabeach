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
    roomAvailability: Room[];
}

export interface BookingPageProps {
    roomAvailability: Room[]; 
}

export interface CalendarProps {
    roomAvailability: Room[];
}