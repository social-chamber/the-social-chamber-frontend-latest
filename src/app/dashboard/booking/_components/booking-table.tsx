"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { format, isToday } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { BookingApiResponse } from "@/types/bookingDataType/bookingDataType";
import DateRangePickerUpdate from "./DateRangePicker";
import { Pagination } from "@/components/ui/pagination";
import type { BookingStatus } from "@/types/booking";

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  refunded: "bg-yellow-100 text-yellow-700 border-yellow-300",
  pending: "bg-amber-100 text-amber-800 border-amber-300",
};

interface SelectedData {
  dateRange: { from: Date | null; to: Date | null };
  queryParams: string;
}

type SortOrder = "asc" | "desc" | null;

// Utility function to format time with proper type safety
const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return "";

  const [hourStr, minuteStr = "00"] = timeStr.split(":");
  const hour = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return "";

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

// API fetch functions
const fetchBookingsByEmail = async (email: string, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking/by-email?email=${encodeURIComponent(email.trim())}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bookings by email: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

const fetchBookings = async (
  currentPage: number,
  status: string,
  selectedData: SelectedData | null,
  token: string
) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking?status=${status || ""}&${selectedData?.queryParams || ""}&page=${currentPage}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bookings: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export function BookingTable() {
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [emailSearch, setEmailSearch] = useState("");
  const [emailInput, setEmailInput] = useState("");

  // Add this new function to handle search execution
  const executeEmailSearch = () => {
    setEmailSearch(emailInput.trim());
    setCurrentPage(1);
    if (emailInput.trim()) {
      setStatus("");
      setShowTodayOnly(false);
      setSelectedData(null);
    }
  };

  // Add this function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeEmailSearch();
    }
  };

  // Extend the session user type to include accessToken
  interface SessionUserWithToken {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  }

  const { data: session } = useSession();
  const token = (session?.user as SessionUserWithToken)?.accessToken as string;

  // Fetch email search data
  const { data: emailData, isLoading: emailLoading } = useQuery<BookingApiResponse>({
    queryKey: ["booking-email", emailSearch],
    queryFn: async () => {
      if (!token || !emailSearch.trim()) {
        return null;
      }
      return await fetchBookingsByEmail(emailSearch, token);
    },
    enabled: !!token && !!emailSearch.trim(),
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Fetch regular bookings data
  const { data: regularData, isLoading: regularLoading, refetch, error } = useQuery<BookingApiResponse>({
    queryKey: ["booking", currentPage, status, selectedData],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return await fetchBookings(currentPage, status, selectedData, token);
    },
    enabled: !!token,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Determine which data to use and loading state
  const isLoading = emailSearch.trim() ? emailLoading : regularLoading;
  const data = emailSearch.trim() ? (emailData || regularData) : regularData;

  useEffect(() => {
    if (
      data?.data?.pagination?.currentPage &&
      data.data.pagination.currentPage !== currentPage
    ) {
      setCurrentPage(data.data.pagination.currentPage);
    }
  }, [data?.data?.pagination?.currentPage, currentPage]);

  const filteredAndSortedBookings = useMemo(() => {
    let bookings: any[] = [];

    if (emailSearch.trim()) {
      // For email search, check if emailData has results
      if (emailData) {
        if (Array.isArray(emailData)) {
          bookings = emailData;
        } else if (emailData?.data) {
          bookings = Array.isArray(emailData.data)
            ? emailData.data
            : emailData.data.bookings || [];
        }
      }
      
      // If no email results found, fall back to regular data
      if (bookings.length === 0 && regularData?.data?.bookings) {
        bookings = regularData.data.bookings;
      }
    } else {
      bookings = regularData?.data?.bookings || [];
    }

    // Filter for today's bookings if showTodayOnly is true
    if (showTodayOnly) {
      bookings = bookings.filter((booking) => isToday(new Date(booking.date)));
    }

    // Sort bookings by date if sortOrder is set
    if (sortOrder) {
      bookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return bookings;
  }, [emailData, regularData, sortOrder, showTodayOnly, emailSearch]);

  // Check if email search returned no results
  const emailSearchHasNoResults = emailSearch.trim() && emailData && (
    (Array.isArray(emailData) && emailData.length === 0) ||
    (emailData?.data && (
      (Array.isArray(emailData.data) && emailData.data.length === 0) ||
      (!Array.isArray(emailData.data) && (!emailData.data.bookings || emailData.data.bookings.length === 0))
    ))
  );

  const handleSortByDate = () => {
    setSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const handleTodayFilter = () => {
    setShowTodayOnly(!showTodayOnly);
    setCurrentPage(1);
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.status}`);
      }

      toast.success("Booking status updated!");
      refetch();
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDateRangeChange = (data: {
    dateRange: { from: Date | null; to: Date | null };
    queryParams: string;
    compare: boolean;
    daysDifference: number;
  }) => {
    setSelectedData({
      dateRange: data.dateRange,
      queryParams: data.queryParams,
    });
    setShowTodayOnly(false);
    setCurrentPage(1);
  };

  const clearEmailSearch = () => {
    setEmailInput("");
    setEmailSearch("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <span className="text-sm text-gray-600">
            {emailSearch.trim()
              ? `Searching bookings for ${emailSearch}...`
              : "Loading bookings..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-2 font-medium">
            Error loading bookings
          </p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          {emailSearch.trim() && (
            <p className="text-xs text-gray-500 mb-4">
              Try checking the email address or clearing the search to view all
              bookings.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-[30px] md:mb-[60px]">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
          <div className="relative w-full sm:w-[250px]">
            <Input
              type="email"
              placeholder="Enter email and click search..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-4 pr-10 bg-white placeholder:text-gray-400 text-black/90 focus:ring-0 border border-black/20"
            />
            <button
              onClick={executeEmailSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              type="button"
              aria-label="Search bookings by email"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
              clearEmailSearch();
            }}
            disabled={!!emailSearch.trim()}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-white placeholder:text-black text-black/90 font-bold focus:ring-0 border border-black/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleTodayFilter}
            variant={showTodayOnly ? "default" : "outline"}
            className="w-full sm:w-auto"
            disabled={!!emailSearch.trim()}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>

          <div
            className={
              emailSearch.trim() ? "opacity-50 pointer-events-none" : ""
            }
          >
            <DateRangePickerUpdate
              onDateRangeChange={handleDateRangeChange}
              defaultDateRange={{ from: null, to: null }}
            />
          </div>
        </div>
      </div>

      {/* Show search results message for email search */}
      {emailSearch.trim() && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            Search results for email:{" "}
            <span className="font-medium">{emailSearch}</span> (
            {(() => {
              let emailBookings: any[] = [];
              if (emailData) {
                if (Array.isArray(emailData)) {
                  emailBookings = emailData;
                } else if (emailData?.data) {
                  emailBookings = Array.isArray(emailData.data)
                    ? emailData.data
                    : emailData.data.bookings || [];
                }
              }
              return emailBookings.length;
            })()} found)
          </p>
          {emailSearchHasNoResults && (
            <p className="text-xs text-gray-600 mt-1">
              Showing all bookings instead.
            </p>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-md shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1200px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  ID
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Phone
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Rooms
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
                  People
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Service
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 min-w-[140px]">
                  <button
                    onClick={handleSortByDate}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Date & Time
                    {getSortIcon()}
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings?.map((booking) => {
                const badgeClass =
                  statusStyles[booking.status as BookingStatus] ??
                  "bg-gray-100 text-gray-700 border-gray-300";
                const isUpdating = updatingId === booking._id;

                return (
                  <tr key={booking._id} className="border-b">
                    <td className="px-4 py-4 text-sm">{booking._id}</td>
                    <td className="px-4 py-4 text-sm">
                      {booking.user?.firstName || ""}{" "}
                      {booking.user?.lastName || ""}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {booking.user?.email || ""}{" "}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {booking.user?.phone || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {booking.room?.title || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm ">
                      {booking?.service?.category?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      {booking.user?.numberOfPeople || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm min-w-[200px]">
                      {booking.service?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm min-w-[140px]">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {format(new Date(booking.date), "MMM dd, yyyy")}
                        </div>
                        <div className="space-y-0.5">
                          {booking.timeSlots?.map(
                            (
                              slot: { start: string; end: string },
                              i: number
                            ) => (
                              <div
                                key={i}
                                className="text-xs text-gray-600 whitespace-nowrap"
                              >
                                {formatTime(slot.start)} -{" "}
                                {formatTime(slot.end)}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      ${booking.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Select
                        defaultValue={booking.status}
                        disabled={isUpdating}
                        onValueChange={(value) =>
                          updateBookingStatus(
                            booking._id,
                            value as BookingStatus
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[130px] h-8 capitalize ${badgeClass} border font-medium`}
                        >
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem
                            value="refunded"
                            disabled={booking.isManualBooking}
                          >
                            Refunded
                          </SelectItem>
                          <SelectItem
                            value="cancelled"
                            // disabled={booking.isManualBooking}
                          >
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="bg-white rounded-b-[8px] py-4">
            {!showTodayOnly &&
              !emailSearch.trim() &&
              regularData?.data?.pagination?.totalPages &&
              regularData.data.pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={regularData?.data?.pagination?.currentPage || 1}
                    totalResults={regularData?.data?.pagination?.totalData || 0}
                    resultsPerPage={Math.ceil(
                      (regularData?.data?.pagination?.totalData || 0) /
                        (regularData?.data?.pagination?.totalPages || 1)
                    )}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

            {showTodayOnly && (
              <div className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredAndSortedBookings.length} booking
                  {filteredAndSortedBookings.length !== 1 ? "s" : ""} for today
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTodayOnly && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            Filtered to show only today&apos;s bookings (
            {filteredAndSortedBookings.length} found)
          </p>
        </div>
      )}


    </div>
  );
}