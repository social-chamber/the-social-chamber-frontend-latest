"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  label: string;
  value: number;
}

interface BookingTrendsProps {
  bookingData: DataPoint[];
}

export function BookingTrends({ bookingData = [] }: BookingTrendsProps) {
  //  // console.log("bookingData", bookingData);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-orange-500">
          Booking Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingData.length > 0 ? (
          <div className="h-[359px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bookingData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} bookings`, "Bookings"]}
                  labelFormatter={(label: string) => label}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B00"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8 }}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No booking data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
