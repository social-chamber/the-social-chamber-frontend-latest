"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/booking";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface BookingStatusCellProps {
  status: BookingStatus;
  onStatusChange: (status: BookingStatus) => void;
}

export function BookingStatusCell({
  status,
  onStatusChange,
}: BookingStatusCellProps) {
  const [open, setOpen] = useState(false);

  const normalizedStatus = status?.toLowerCase();

  const statuses = [
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "canceled", label: "Canceled" },
    { value: "refunded", label: "Refunded" },
  ] as const;

  const statusStyles: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 border-green-300",
    canceled: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    refunded: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const currentStatus = statuses.find((s) => s.value === normalizedStatus);

  const buttonStyle =
    statusStyles[normalizedStatus] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[130px] justify-between border px-3 py-1 h-7 font-normal",
            buttonStyle
          )}
        >
          {currentStatus?.label ?? normalizedStatus ?? "Unknown"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((statusOption) => (
                <CommandItem
                  key={statusOption.value}
                  value={statusOption.value}
                  onSelect={() => {
                    onStatusChange(statusOption.value as BookingStatus);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {statusOption.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-primary",
                      normalizedStatus === statusOption.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
