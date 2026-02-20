"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookingStore } from "@/store/booking";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CategorySelection from "./category-selection";
import ConfirmDetails from "./confirm-details";
import RoomSelection from "./room-selection";
import ServiceSelection from "./service-selection";
import TimeSelection from "./time-selection";

export function BookingTabs() {
  const { currentStep, setStep } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is returning from payment page
  useEffect(() => {
    if (mounted) {
      const urlParams = new URLSearchParams(window.location.search);
      const fromPayment = urlParams.get("from");

      if (fromPayment === "payment") {
        // User came back from payment page, show appropriate message
        toast.info(
          "Payment was not completed. Please try again or contact support if you need assistance.",
        );
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <Tabs
      value={currentStep}
      onValueChange={(value: any) => setStep(value as any)}
      className="w-full  mx-auto"
    >
      <TabsList className="flex min-h-[50px] sm:grid sm:grid-cols-5 overflow-x-auto whitespace-nowrap gap-4 sm:gap-0 mb-[80px] px-4">
        <TabsTrigger
          value="category"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full min-w-max"
        >
          Category
        </TabsTrigger>
        <TabsTrigger
          value="rooms"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full min-w-max"
        >
          Rooms
        </TabsTrigger>
        <TabsTrigger
          value="services"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full min-w-max"
        >
          Book Now
        </TabsTrigger>
        <TabsTrigger
          value="time"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full min-w-max"
        >
          Time
        </TabsTrigger>
        <TabsTrigger
          value="confirm"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full min-w-max"
        >
          Confirm details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="category">
        <CategorySelection />
      </TabsContent>
      <TabsContent value="rooms">
        <RoomSelection />
      </TabsContent>
      <TabsContent value="services">
        <ServiceSelection />
      </TabsContent>
      <TabsContent value="time">
        <TimeSelection />
      </TabsContent>
      <TabsContent value="confirm">
        <ConfirmDetails />
      </TabsContent>
    </Tabs>
  );
}
