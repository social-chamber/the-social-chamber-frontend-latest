"use client";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { useBookingStore } from "@/store/booking/index";
import type { Service, ServiceResponse } from "@/types/service";
import { useQuery } from "@tanstack/react-query";
import { Clock, Users } from "lucide-react";
import { getDisplayPricePerSlot, formatPrice } from "@/lib/pricingUtils";

// This file provides mock data for development and testing

export default function ServiceSelection() {
  const { room, setStep, categoryId, selectedCategoryName } = useBookingStore();

  const roomId = room?._id;

  const { data, isLoading, isError, error } = useQuery<ServiceResponse>({
    queryKey: ["services", categoryId, roomId],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/services/category/${categoryId}?t=${Date.now()}`,
        { headers: { "cache-control": "no-cache" } }
      ).then((res) => res.json()),
    enabled: !!roomId && !!categoryId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Redirect if no room is selected
  if (!roomId) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">Please select a room first</p>
        <Button
          onClick={() => setStep("rooms")}
          className="mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Go to Room Selection
        </Button>
      </div>
    );
  }

  let content;

  if (isLoading) {
    content = (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <SkeletonWrapper key={n} isLoading={isLoading}>
            <ServiceCard />
          </SkeletonWrapper>
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[300px] flex-col">
        <h1 className="text-lg font-semibold text-red-500">Error</h1>
        <p className="text-gray-400">
          {error?.message ?? "Something went wrong"}
        </p>
      </div>
    );
  } else if (data && Array.isArray(data.data) && data.data.length === 0) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[300px]">
        <h1 className="text-gray-400 text-lg">No Services Found</h1>
      </div>
    );
  } else {
    let filtered = Array.isArray(data?.data) ? data.data.filter(
      (s: Service) => s.name !== "Late Night Special"
    ) : [];
    if (selectedCategoryName === "Hourly") {
      filtered = filtered.slice(0, 6);
    }
    content = (
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((service: Service, index) => (
          <ServiceCard key={service._id?.toString() || service.name || index} service={service} />
        ))}
      </div>
    );
  }

  return <div>{content}</div>;
}

type ServiceCardProps = {
  service?: Service;
};
export function ServiceCard({ service }: ServiceCardProps) {
  const { setService, selectedCategoryName } = useBookingStore();

  const serviceData = service;
  const displayPrice = getDisplayPricePerSlot(serviceData?.pricePerSlot ?? 0); // Includes $1 platform fee

  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    if (t === "00:00") return 0;
    return h * 60 + m;
  };

  // compact time formatter was removed from title display per simplified UI

  const computeWindowHours = () => {
    const start = serviceData?.timeRange?.start || "";
    const end = serviceData?.timeRange?.end || "";
    const startM = toMins(start);
    let endM = toMins(end);
    if (endM <= startM) endM += 1440;
    return Math.round((endM - startM) / 60);
  };

  const getHourlyDurationLabel = () => {
    const n = (serviceData?.name || "").toLowerCase();
    // Explicit name-based overrides per spec (be tolerant to current backend names)
    if (n.includes("mon-fri (9am-12pm) early bird")) return "3h";
    if (n.includes("fri (12am-6pm) non-peak")) return "6h";
    if (n.includes("mon-thurs") && n.includes("12pm") && n.includes("non-peak"))
      return "3h"; // covers 12pm-3pm and current 12pm-9am label
    if (n.includes("friday night (6pm-12am) peak")) return "3h";
    if (n.includes("sat/sun (12am-9am) peak")) return "9h";
    if (n.includes("sat/sun (12am-12am) peak")) return "9h"; // UI override
    if (n.includes("mon-fri (12am-9am) non-peak")) return "3h";
    const hours = computeWindowHours();
    return `${hours}h`;
  };

  const buildDisplayTitle = () => {
    return (serviceData?.name || "").trim();
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{buildDisplayTitle()}</h3>
          <div className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            {formatPrice(displayPrice)}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-orange-500 text-white flex items-center gap-x-1">
            <Clock className="h-3 w-3" />{" "}
            {selectedCategoryName === "Hourly"
              ? getHourlyDurationLabel()
              : `${computeWindowHours()}h`}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-orange-500 text-white flex items-center gap-x-1">
            <Users className="h-3 w-3" /> 1/5
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          {serviceData && (
            <Button
              onClick={() => setService(serviceData)}
              className="w-full bg-white border border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Select
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
