"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BookingHeader() {
  return (
    <div className="flex items-center justify-between mb-[60px]">
      <h1 className="text-2xl font-bold">Booking Management</h1>
      <div className="flex items-center gap-10">
        <div>
          <Select>
            <SelectTrigger className="w-[180px] bg-white placeholder:text-black text-black/90 font-bold focus:ring-0 border border-black/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <DateRangePicker
            // onUpdate={(values) =>   console.log(values)}
            initialDateFrom="2025-05-24"
            initialDateTo="2025-05-30"
            align="start"
            locale="en-GB"
            showCompare={false}
          />
        </div>
      </div>
    </div>
  );
}
