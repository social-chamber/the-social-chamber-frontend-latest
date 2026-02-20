"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function PaymentStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'pending' | 'success' | 'failed'>('loading');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Get booking ID from sessionStorage
    const storedBookingId = sessionStorage.getItem('pendingBookingId');
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    // Always set booking ID if available
    if (storedBookingId) {
      setBookingId(storedBookingId);
    }
    
    // If we have a redirect URL, redirect to Stripe after a short delay
    if (redirectUrl) {
      setStripeUrl(redirectUrl);
      setStatus('pending');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Cleanup timer on unmount
      return () => clearInterval(timer);
    } else if (storedBookingId) {
      // No redirect URL but we have a booking ID - show pending status
      setStatus('pending');
    } else {
      // No booking ID and no redirect URL - show failed status
      setStatus('failed');
    }
  }, []);

  const handleBackToBooking = () => {
    // Clear session storage
    sessionStorage.removeItem('pendingBookingId');
    // Navigate back to booking page
    router.push('/booking');
  };

  const handleRetryPayment = () => {
    if (bookingId) {
      // Redirect to payment intent again
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/payment-intent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          booking: bookingId,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          window.location.href = data.data.url;
        }
      })
      .catch((error) => {
        console.error('Payment retry failed:', error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-orange-500" />
              <p className="text-gray-600">Checking payment status...</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stripeUrl ? 'Redirecting to Payment...' : 'Payment Pending'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {stripeUrl 
                    ? `You will be redirected to complete your payment in ${countdown} seconds...`
                    : 'Your booking is being processed. Please complete your payment to confirm your reservation.'
                  }
                </p>
                {bookingId && (
                  <p className="text-xs text-gray-500 mt-2">
                    Booking ID: {bookingId}
                  </p>
                )}
                {stripeUrl && (
                  <div className="mt-3">
                    <Button 
                      onClick={() => window.location.href = stripeUrl}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Go to Payment Now
                    </Button>
                  </div>
                )}
              </div>
              {!stripeUrl && (
                <div className="space-y-2">
                  <Button 
                    onClick={handleRetryPayment}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Complete Payment
                  </Button>
                  <Button 
                    onClick={handleBackToBooking}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Booking
                  </Button>
                </div>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 text-sm">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/success')}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                View Booking Details
              </Button>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Failed
                </h3>
                <p className="text-gray-600 text-sm">
                  There was an issue processing your payment. Please try again or contact support.
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleRetryPayment}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleBackToBooking}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Booking
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
