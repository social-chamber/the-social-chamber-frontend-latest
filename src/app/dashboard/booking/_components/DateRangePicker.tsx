"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, isSameDay, isWithinInterval, isBefore } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"

interface DateRange {
  from: Date | null
  to: Date | null
}

interface CalendarDayProps {
  date: Date
  isSelected: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  onClick: (date: Date) => void
  isOtherMonth: boolean
}

interface CustomCalendarProps {
  month: Date
  selectedRange: DateRange
  onDateSelect: (date: Date) => void
  className?: string
}

interface DateRangePickerProps {
  onDateRangeChange?: (data: {
    dateRange: DateRange
    queryParams: string
    compare: boolean
    daysDifference: number
  }) => void
  defaultDateRange?: DateRange
  className?: string
}

// Custom Calendar Day Component
const CalendarDay = ({
  date,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onClick,
  isOtherMonth,
}: CalendarDayProps) => {
  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "h-9 w-9 p-0 font-normal text-sm rounded-md hover:bg-gray-100 transition-colors",
        isOtherMonth && "text-gray-400",
        isSelected && "bg-black text-white hover:bg-black",
        isInRange && !isSelected && "bg-gray-200",
        isRangeStart && "bg-black text-white rounded-r-none",
        isRangeEnd && "bg-black text-white rounded-l-none",
        (isRangeStart || isRangeEnd) && "hover:bg-black",
      )}
    >
      {format(date, "d")}
    </button>
  )
}

// Custom Calendar Component
const CustomCalendar = ({ month, selectedRange, onDateSelect, className }: CustomCalendarProps) => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const startDate = new Date(startOfMonth)
  startDate.setDate(startDate.getDate() - startOfMonth.getDay())

  const days: Date[] = []
  const current = new Date(startDate)

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const isDateInRange = (date: Date): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false
    return isWithinInterval(date, { start: selectedRange.from, end: selectedRange.to })
  }

  const isRangeStart = (date: Date): boolean => {
    return selectedRange.from ? isSameDay(date, selectedRange.from) : false
  }

  const isRangeEnd = (date: Date): boolean => {
    return selectedRange.to ? isSameDay(date, selectedRange.to) : false
  }

  const isSelected = (date: Date): boolean => {
    return isRangeStart(date) || isRangeEnd(date)
  }

  const isOtherMonth = (date: Date): boolean => {
    return date.getMonth() !== month.getMonth()
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-9 w-9 text-center text-sm font-medium text-gray-500 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <CalendarDay
            key={index}
            date={date}
            isSelected={isSelected(date)}
            isInRange={isDateInRange(date)}
            isRangeStart={isRangeStart(date)}
            isRangeEnd={isRangeEnd(date)}
            onClick={onDateSelect}
            isOtherMonth={isOtherMonth(date)}
          />
        ))}
      </div>
    </div>
  )
}

export default function DateRangePickerUpdate({
  onDateRangeChange,
  defaultDateRange,
  className,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange>(
    defaultDateRange || {
      from: new Date(2025, 3, 10), // April 10, 2025
      to: new Date(2025, 3, 20), // April 20, 2025
    },
  )
  const [tempDateRange, setTempDateRange] = useState<DateRange>(dateRange)
  const [compare] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 3)) // April 2025

  const handleDateSelect = (date: Date): void => {
    if (!tempDateRange.from || (tempDateRange.from && tempDateRange.to)) {
      // Start new selection
      setTempDateRange({ from: date, to: null })
    } else if (isBefore(date, tempDateRange.from)) {
      // Selected date is before start date, make it the new start
      setTempDateRange({ from: date, to: tempDateRange.from })
    } else {
      // Selected date is after start date, make it the end
      setTempDateRange({ ...tempDateRange, to: date })
    }
  }

  const generateQueryParams = (): string => {
    if (!tempDateRange.from || !tempDateRange.to) return ""

    const startDate = format(tempDateRange.from, "yyyy-MM-dd")
    const endDate = format(tempDateRange.to, "yyyy-MM-dd")

    return `startDate=${startDate}&endDate=${endDate}`
  }

   // console.log(dateRange)

  const handleUpdate = (): void => {
    setDateRange(tempDateRange)
    setOpen(false)

    const queryParams = generateQueryParams()
    const daysDifference =
      tempDateRange.from && tempDateRange.to
        ? Math.ceil((tempDateRange.to.getTime() - tempDateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 0

    const data = {
      dateRange: tempDateRange,
      queryParams,
      compare,
      daysDifference,
    }

    // Log data to console in the format you requested
     // console.log(queryParams)

    // Call the parent component's callback function
    if (onDateRangeChange) {
      onDateRangeChange(data)
    }
  }

  const handleCancel = (): void => {
    setTempDateRange(dateRange)
    setOpen(false)
  }

  const formatDateRange = (): string => {
    // Use tempDateRange when popover is open, otherwise use confirmed dateRange
    const rangeToFormat = open ? tempDateRange : dateRange

    if (!rangeToFormat.from) return "Select date range"
    if (!rangeToFormat.to) return format(rangeToFormat.from, "MMM dd, yyyy")
    if (isSameDay(rangeToFormat.from, rangeToFormat.to)) {
      return format(rangeToFormat.from, "MMM dd, yyyy")
    }
    return `${format(rangeToFormat.from, "MMM dd, yyyy")} - ${format(rangeToFormat.to, "MMM dd, yyyy")}`
  }

  // const formatTempDateRange = (): string => {
  //   if (!tempDateRange.from) return "5/24/2025 - 5/24/2025"
  //   if (!tempDateRange.to) {
  //     const fromFormatted = format(tempDateRange.from, "M/dd/yyyy")
  //     return `${fromFormatted} - ${fromFormatted}`
  //   }
  //   return `${format(tempDateRange.from, "M/dd/yyyy")} - ${format(tempDateRange.to, "M/dd/yyyy")}`
  // }

  const nextMonth = (): void => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = (): void => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[300px] justify-start text-left font-normal bg-white ",
            !dateRange.from && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mr-12" align="start">
        <div className="p-4 space-y-4 ">
          {/* Compare Toggle */}
          {/* <div className="flex items-center space-x-2">
            <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
            <Label htmlFor="compare">Compare</Label>

           
            <div className="flex items-center space-x-1 ml-4 text-sm">
              <span>{formatTempDateRange()}</span>
            </div>
          </div> */}

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between ">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-8">
              <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
              <span className="font-medium">{format(addMonths(currentMonth, 1), "MMMM yyyy")}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dual Calendar */}
          <div className="flex space-x-4">
            <CustomCalendar
              month={currentMonth}
              selectedRange={tempDateRange}
              onDateSelect={handleDateSelect}
              className="border rounded-md"
            />
            <CustomCalendar
              month={addMonths(currentMonth, 1)}
              selectedRange={tempDateRange}
              onDateSelect={handleDateSelect}
              className="border rounded-md"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="bg-black text-white hover:bg-gray-800">
              Update
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
