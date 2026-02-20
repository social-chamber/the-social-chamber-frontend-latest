
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";

interface DashboardCardsProps {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  averageBookingDuration: number; // In hours
}

export function DashboardCards({
  totalBookings,
  totalRevenue,
  totalCustomers,
  averageBookingDuration,
}: DashboardCardsProps) {
  return (
    <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-4">
      <Card className="space-y-[10px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-[#000000]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-[10px]">{totalBookings}</div>
          {/* <p className="text-xs text-muted-foreground text-[#008837]">
            +5.2% from last month
          </p> */}
        </CardContent>
      </Card>

      <Card className="space-y-[10px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-[#000000]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-[10px]">${totalRevenue}</div>
          {/* <p className="text-xs text-muted-foreground text-[#008837]">
            +10.5% from last month
          </p> */}
        </CardContent>
      </Card>

      <Card className="space-y-[10px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Refunds</CardTitle>
          <Users className="h-4 w-4 text-[#000000]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-[10px]">{totalCustomers?.toFixed(2)}</div>
          {/* <p className="text-xs text-muted-foreground text-[#008837]">
            +19% from last month
          </p> */}
        </CardContent>
      </Card>

      <Card className="space-y-[10px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Booking Duration</CardTitle>
          <Clock className="h-4 w-4 text-[#000000]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-[10px]">{averageBookingDuration}h</div>
          {/* <p className="text-xs text-muted-foreground text-[#008837]">
            +0.1h from last week
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
