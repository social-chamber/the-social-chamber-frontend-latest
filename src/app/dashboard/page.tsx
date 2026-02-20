"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { BookingTrends } from "./_components/booking-trends";
import { CustomerTypes } from "./_components/customer-types";
import { DashboardCards } from "./_components/dashboard-cards";
import { DashboardHeader } from "./_components/dashboard-header";
import { RecentBookings } from "./_components/recent-booking";
import { RevenueTrends } from "./_components/revenue-trends";

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  // Default date range: last 7 days
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  // Fetch dashboard data using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData", dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/dashboard/?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      return res.json();
    },
    enabled: !!token, // only fetch when token is available
  });

   // console.log("data", data?.data);

  const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
    setDateRange(newDateRange);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error loading dashboard data</h2>
          <p className="mt-2">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const {
    totalBookings,
    totalRevenue,
    totalRefund,
    // bookingTrends,
    recentBookings,
    customerTypes,
    // revenueTrends,
  } = data?.data || {};

  const averageBookingDuration = data?.data?.averageBookingDuration?.formatted || 0;
  const bookingTrends = data?.data?.trends.bookingData || [];
  const revenueTrends = data?.data?.trends.revenueData || [];
  //  // console.log("bookingTrends", bookingTrends);
  
  //  // console.log("bookingTrends", bookingTrends);
  //  // console.log("recentBookings", recentBookings);
   // console.log("customerTypes", customerTypes);
  //  // console.log("revenueTrends", revenueTrends);

  return (
    <div className="space-y-6 py-[50px] px-[40px]">
      <DashboardHeader onDateRangeChange={handleDateRangeChange} currentDateRange={dateRange} />

      <DashboardCards
        totalBookings={totalBookings}
        totalRevenue={totalRevenue}
        totalCustomers={totalRefund}
        averageBookingDuration={averageBookingDuration}
      />



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-full">
          <BookingTrends bookingData={bookingTrends} />
        </div>
        <div className="h-full">
          <RecentBookings bookings={recentBookings} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          {/* <customerTypes data={customerTypes} /> */}
          <CustomerTypes data={customerTypes} />
        </div>
        <div className="md:col-span-2">
          <RevenueTrends data={revenueTrends} />
        </div>
      </div>
    </div>
  );
}
