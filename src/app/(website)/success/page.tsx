"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const SuccessPage = () => {
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get booking ID from sessionStorage (set during payment process)
    const storedBookingId = sessionStorage.getItem("pendingBookingId");
    if (storedBookingId) {
      setBookingId(storedBookingId);
      // Clear the session storage after retrieving
      sessionStorage.removeItem("pendingBookingId");
    }
  }, []);

  // Fetch booking details if we have a booking ID
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/booking/${bookingId}`
      );
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
    enabled: !!bookingId,
    refetchInterval: (query) => {
      // If booking is still pending, poll every 5 seconds
      // If confirmed, stop polling
      const data = query.state.data as any;
      return data?.data?.status === "pending" ? 5000 : false;
    },
    refetchIntervalInBackground: true,
  });

  const booking = bookingData?.data;

  return (
    <div className="my-32">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardContent className="pt-6 px-6 pb-0">
          <div className="flex flex-col items-center mb-6">
            <div
              className={`rounded-full p-2 mb-2 ${
                booking?.status === "confirmed"
                  ? "bg-green-500"
                  : booking?.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            >
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-center">
              {booking?.status === "confirmed"
                ? "Payment Successful!"
                : booking?.status === "pending"
                  ? "Payment Received!"
                  : "Payment Processing"}
            </h2>
            <p
              className={`text-center text-sm mt-1 ${
                booking?.status === "confirmed"
                  ? "text-green-600"
                  : booking?.status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-600"
              }`}
            >
              {booking?.status === "confirmed"
                ? "Your payment has been processed successfully. Your booking is now confirmed!"
                : booking?.status === "pending"
                  ? "Your payment has been received. We are processing your booking confirmation."
                  : "Your payment is being processed. Please wait for confirmation."}
            </p>
          </div>

          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          ) : booking ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-semibold ${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : booking.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {booking.status === "confirmed"
                    ? "Confirmed"
                    : booking.status === "pending"
                      ? "Payment Processing..."
                      : booking.status || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Booking ID:</span>
                <span className="text-gray-600">{booking._id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Name:</span>
                <span className="text-gray-600">
                  {booking?.user?.firstName} {booking?.user?.lastName}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email:</span>
                <span className="text-gray-600">{booking?.user?.email}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Phone:</span>
                <span className="text-gray-600">{booking?.user?.phone}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Category:</span>
                <span className="text-gray-600">
                  {booking?.service?.category?.name}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Room:</span>
                <span className="text-gray-600">{booking?.room?.title}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Service:</span>
                <span className="text-gray-600">{booking?.service?.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Date:</span>
                <span className="text-gray-600">
                  {new Date(booking?.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Time:</span>
                <span className="text-gray-600">
                  {booking?.timeSlots
                    ?.map(
                      (slot: { start: string; end: string }) =>
                        `${slot.start} - ${slot.end}`
                    )
                    .join(", ")}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Status:</span>
                <span className="text-yellow-600 font-semibold">
                  Payment Processing...
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Next Steps:</span>
                <span className="text-gray-600">Waiting for confirmation</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600 text-center">
            {booking?.status === "confirmed"
              ? "📬 Please check your Gmail for the confirmation message and booking details. If you don&apos;t see it, make sure to check your spam or junk folder as well."
              : "📬 We will send you further information through Gmail once your payment is processed and booking is confirmed."}
          </p>
          <div className="flex gap-2 w-full">
            <Link href={"/"} className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Go to Home
              </Button>
            </Link>
            {bookingId && (
              <Link href={`/success/${bookingId}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
