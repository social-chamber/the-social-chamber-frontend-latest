"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface CreatePromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createPromoCode = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promo-codes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create promo code");
  }

  return response.json();
};

export default function CreatePromoModal({
  isOpen,
  onClose,
}: CreatePromoCodeModalProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    undefined
  );
  const [usageLimit, setUsageLimit] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;

  const mutation = useMutation({
    mutationFn: ({ data, token }: { data: any; token: string }) =>
      createPromoCode({ data, token }),
    onSuccess: () => {
      // console.log("Promo code created successfully:", data);
      onClose();
      toast.success("Promo code created successfully");
      setTimeout(() => {
        window.location.href = "/dashboard/promo";
      }, 2000);
    },
    onError: (error) => {
      console.error("Error creating promo code:", error);
      toast.error("Failed to create promo code");
    },
  });

  const handleSubmit = () => {
    if (
      !promoCode ||
      !discountType ||
      !discountValue ||
      !expirationDate ||
      !usageLimit
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (!token) {
      toast.error("You are not authorized. Please log in.");
      return;
    }

    const data = {
      code: promoCode,
      discountType,
      discountValue: Number(discountValue),
      expiryDate: expirationDate.toISOString().split("T")[0], // format YYYY-MM-DD
      usageLimit: Number(usageLimit),
    };

    mutation.mutate({ data, token });
  };

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }

    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  const formattedDate = expirationDate
    ? new Date(
        expirationDate.toLocaleString("en-US", { timeZone: "Asia/Singapore" })
      )
        .toISOString()
        .slice(0, 10)
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-6 overflow-hidden rounded-lg">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#FF6B00]">
              Create New Promo Code
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-[#FF6B00] mt-2" />
        </div>

        <div className="p-4 space-y-4 bg-[#F5F5F5] rounded-md">
          <div className="grid grid-cols-[120px,1fr] items-center gap-2">
            <div className="text-sm font-medium">Promo Code :</div>
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-2">
            <div className="text-sm font-medium">Discount Type :</div>
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Select a discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-2">
            <div className="text-sm font-medium">Discount Value :</div>
            <Input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="bg-white"
            />
          </div>

          <div
            className="grid grid-cols-[120px,1fr] items-center gap-2 relative"
            ref={calendarRef}
          >
            <div className="text-sm font-medium">Expiration Date :</div>
            <div className="relative w-full">
              <Input
                type="text"
                readOnly
                value={formattedDate}
                placeholder="Select a date"
                onClick={() => setCalendarOpen((open) => !open)}
                className="bg-white cursor-pointer pr-10"
              />
              <Calendar
                onClick={() => setCalendarOpen((open) => !open)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              />
              {calendarOpen && (
                <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg overflow-visible">
                  <DayPicker
                    mode="single"
                    selected={expirationDate}
                    onSelect={(date) => {
                      if (date) {
                        // ✅ Normalize to local midnight to prevent timezone shift
                        const normalizedDate = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate() + 1
                        );
                        setExpirationDate(normalizedDate);
                        setCalendarOpen(false);
                      }
                    }}
                    fromDate={new Date()}
                    initialFocus
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[120px,1fr] items-center gap-2">
            <div className="text-sm font-medium">Usage Limit :</div>
            <Input
              type="number"
              min={1}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex justify-center gap-[30px] p-4 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 border-0 text-gray-700 rounded-md px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-[#FF6B00] hover:bg-[#e05f00] text-white rounded-md px-6"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
