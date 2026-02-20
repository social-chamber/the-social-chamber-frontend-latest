"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueTrendsProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function RevenueTrends({ data = [] }: RevenueTrendsProps) {
   // console.log("data", data);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>

      {data && data.length > 0 ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" stroke="#888888" fontSize={12} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Revenue"]}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No revenue data available</p>
        </div>
      )}
    </div>
  );
}
