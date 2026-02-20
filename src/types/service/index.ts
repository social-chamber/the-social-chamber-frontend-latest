type AvailableDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface TimeRange {
  start: string; // format: "HH:mm"
  end: string; // format: "HH:mm"
}

export interface Service {
  _id: string;
  category: string;
  name: string;
  availableDays: AvailableDay[];
  slotDurationHours: number;
  pricePerSlot: number;
  timeRange: TimeRange;
  __v: number;
  maxPeopleAllowed?: number; // optional because not all plans may have this
  description?: string; // optional for the same reason
}

export interface ServiceResponse {
  success: boolean;
  data: Service[];
  message: string;
}
