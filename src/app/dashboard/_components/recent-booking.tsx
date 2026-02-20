import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

interface Booking {
  id: string;
  firstName: string;
  date: string;
  amount: number;
  user: { firstName: string };
  status: "confirmed" | "pending" | "cancelled";
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings = [] }: RecentBookingsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[20px] font-medium text-[#FF6900]">
          Recent Bookings
        </CardTitle>
        {/* <Link
          href="/dashboard/bookings"
          className="text-xs text-blue-500 hover:underline"
        >
          View All
        </Link> */}
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border border-[#0000001A] px-[12px] py-[8px] rounded-xl mt-7"
              >
                <div>
                  <div className="font-medium text-[14px] text-[#000000] mb-[6px]">
                    {booking?.user?.firstName}
                  </div>
                  <div className="text-[12px] font-medium">
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge
                  variant={
                    booking.status === "confirmed" ? "default" : "destructive"
                  }
                  className={
                    booking.status === "confirmed"
                      ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7]"
                      : booking.status === "cancelled"
                      ? "bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]"
                      : "bg-[#FEF9C3] text-[#92400E] hover:bg-[#FEF9C3]"
                  }
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground text-sm">No recent bookings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

