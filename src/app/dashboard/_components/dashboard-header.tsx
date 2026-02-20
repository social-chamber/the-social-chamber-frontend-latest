

"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  onDateRangeChange: (dateRange: { startDate: string; endDate: string }) => void
  currentDateRange: { startDate: string; endDate: string }
}

export function DashboardHeader({ onDateRangeChange, currentDateRange }: DashboardHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(currentDateRange.startDate),
    to: new Date(currentDateRange.endDate),
  })

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value)

    if (value === "custom") {
      setIsDialogOpen(true)
    } else {
      // Calculate date range based on selection
      const endDate = new Date()
      let startDate = new Date()

      switch (value) {
        case "today":
          startDate = new Date()
          break
        case "yesterday":
          startDate = new Date()
          startDate.setDate(startDate.getDate() - 1)
          endDate.setDate(endDate.getDate() - 1)
          break
        case "7days":
          startDate.setDate(startDate.getDate() - 7)
          break
        case "30days":
          startDate.setDate(startDate.getDate() - 30)
          break
        case "90days":
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      onDateRangeChange({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      })
    }
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDate(range)
    }
  }

  const handleApplyCustomRange = () => {
    if (date?.from && date?.to) {
      onDateRangeChange({
        startDate: format(date.from, "yyyy-MM-dd"),
        endDate: format(date.to, "yyyy-MM-dd"),
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[24px] font-semibold">Overview</h1>

      <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px] bg-[#FF6900] text-white border-none">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Custom Date Range</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              className="rounded-md border"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyCustomRange} className="bg-[#FF6900] hover:bg-[#e55a00] text-white">
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
