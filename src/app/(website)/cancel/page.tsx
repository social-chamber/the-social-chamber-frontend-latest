"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, XCircle, AlertTriangle } from "lucide-react";

function CancelPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookingIdParam = searchParams.get("bookingId");
    setBookingId(bookingIdParam);
    setIsLoading(false);
  }, [searchParams]);

  const handleBackToBooking = () => {
    // Clear any stored booking data
    sessionStorage.removeItem("pendingBookingId");
    // Navigate back to booking page
    router.push("/booking");
  };

  const handleRetryBooking = () => {
    // Clear stored data and start fresh
    sessionStorage.removeItem("pendingBookingId");
    router.push("/booking");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Process Cancelled
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                You cancelled the payment process. Your booking has not been
                confirmed and no charges have been made.
              </p>

              {bookingId && (
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Booking Reference:
                  </p>
                  <p className="text-sm font-mono text-gray-700">{bookingId}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">
                    This booking reference is no longer valid. You&apos;ll need
                    to create a new booking to proceed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetryBooking}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Create New Booking
            </Button>

            <Button
              onClick={handleBackToBooking}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking Page
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <CancelPageContent />
    </Suspense>
  );
}
