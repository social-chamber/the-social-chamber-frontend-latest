export type BookingStatus = "refunded" | "confirmed" | "cancelled" | "pending";

export interface TimeSlot {
  _id: string;
  start: string;
  end: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfPeople: number;
}

export interface Booking {
  _id: string;
  user: User;
  room: string;
  promoCode?: string;
  date: string;
  timeSlots: TimeSlot[];
  service: string;
  total: number;
  status: BookingStatus;
  stripeSessionId: string | null;
  refundId: string | null;
  refundedAt: string | null;
  expiresAt: string;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}
