export interface BookingApiResponse {
  status: boolean;
  message: string;
  data: {
    bookings: Booking[];
    pagination: Pagination;
  };
}

export interface Booking {
   isManualBooking: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfPeople: number;
  };
  _id: string;
  room: {
    _id: string;
    title: string;
    image: string;
    category: string;
    maxCapacity: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  promoCode: {
    _id: string;
    code: string;
    discountType: string;
    discountValue: number;
    expiryDate: string;
    usageLimit: number;
    active: boolean;
    usedCount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  date: string;
  timeSlots: {
    start: string;
    end: string;
    _id: string;
  }[];
  service: {
    timeRange: {
      start: string;
      end: string;
    };
    _id: string;
    category: {
      name: string;
    };
    name: string;
    availableDays: string[];
    slotDurationHours: number;
    pricePerSlot: number;
    maxPeopleAllowed?: number;
    description?: string;

    __v: number;
  };
  total: number;
  status: "confirmed" | "cancelled";
  stripeSessionId: string | null;
  refundId: string | null;
  refundedAt: string | null;
  expiresAt: string;
  paymentStatus: "paid" | "pending";
  freeSlotsAwarded: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
