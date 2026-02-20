"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/booking";
import { useQuery } from "@tanstack/react-query";
import { isBefore, startOfDay } from "date-fns";
import moment from "moment";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface TimeSlotsApiRes {
  status: boolean;
  message: string;
  data: TimeSlot[];
}

export default function TimeSelection() {
  const {
    service,
    setStep,
    selectedCategoryName,
    selectedDate,
    selectDate,
    selectTimeSlot,
    selectedTimeSlot,
    room,
  } = useBookingStore();

  const serviceId = service?._id;
  const roomId = room?._id;

  const dateOnly = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : "";

  const { data, isLoading } = useQuery<TimeSlotsApiRes>({
    queryKey: ["timeSlots", serviceId, dateOnly, roomId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking/check-availability`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            date: dateOnly,
            serviceId,
            roomId,
          }),
        },
      );
      return res.json();
    },
    enabled: !!serviceId && !!dateOnly,
  });

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const isPastDate = (date: Date) =>
    isBefore(date, startOfDay(new Date()));

  const isUnavailableDay = (date: Date) => {
    if (!service?.availableDays) return false;
    const day = date.toLocaleDateString("en-SG", { weekday: "short" });
    return !service.availableDays.includes(day as any);
  };

  const timeSlots = data?.data ?? [];

  const isDisabled =
    !selectedTimeSlot || selectedTimeSlot.length === 0;

  if (!serviceId) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-medium">Please select a service first</p>
        <Button
          onClick={() => setStep("services")}
          className="mt-4 bg-orange-500"
        >
          Go to Service Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* DATE */}
      <div className="border rounded-lg p-4">
        <h2 className="font-medium text-orange-500 mb-4">
          Select Date
        </h2>
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => selectDate(date || null)}
          disabled={(date) =>
            isPastDate(date) || isUnavailableDay(date)
          }
        />
      </div>

      {/* TIME */}
      <div className="border rounded-lg p-4">
        <h2 className="font-medium text-orange-500 mb-4">
          Available Time Slots
        </h2>

        {!selectedDate ? (
          <p className="text-center text-gray-500 py-8">
            Select a date to see available times
          </p>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">
              No available slots for this date
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {timeSlots.map((slot, i) => (
              <button
                key={i}
                disabled={!slot.available}
                onClick={() =>
                  slot.available &&
                  selectTimeSlot({
                    start: slot.start,
                    end: slot.end,
                  })
                }
                className={cn(
                  "w-full py-3 px-4 border rounded transition",
                  slot.available
                    ? "border-yellow-400 hover:bg-yellow-50"
                    : "border-red-300 bg-red-50 cursor-not-allowed",
                  selectedTimeSlot?.some(
                    (s: any) =>
                      s.start === slot.start &&
                      s.end === slot.end,
                  ) &&
                    "bg-orange-500 text-white border-orange-500",
                )}
              >
                <div className="flex justify-between">
                  <span>
                    {formatTime(slot.start)} –{" "}
                    {formatTime(slot.end)}
                  </span>
                  {!slot.available && (
                    <span className="text-red-600 text-sm">
                      Booked
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <Button
          disabled={isDisabled}
          onClick={() => setStep("confirm")}
          className={cn(
            "mt-4 w-full",
            isDisabled
              ? "bg-gray-400"
              : "bg-orange-500 hover:bg-orange-500/80",
          )}
        >
          {isDisabled ? "No Slot Selected" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
