"use client";
import React from "react";
import BookingConfirmation from "./_components/booking-confirmation";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const id = pathname.replace("/success/", "");
  return (
    <div>
      <BookingConfirmation bookingId={id} />
    </div>
  );
}
