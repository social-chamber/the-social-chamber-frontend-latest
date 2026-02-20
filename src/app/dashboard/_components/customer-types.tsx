"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

interface CustomerTypesProps {
  data: {
    new: number
    returning: number
  }
}

const COLORS = ["#FFC107", "#FF6B00"]

export function CustomerTypes({ data }: CustomerTypesProps) {
  // Transform the object data into the array format needed for the chart
  const chartData = [
    { name: "New", value: data?.new },
    { name: "Return", value: data?.returning },
  ].filter(item => item.value > 0) // Only show items with values greater than 0

  // If no data has values > 0, show a message
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-orange-500">
            Customer Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[359px] flex items-center justify-center">
            <p className="text-muted-foreground">No customer data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-orange-500">
          Customer Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[359px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
