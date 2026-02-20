"use client";

// import { useState } from "react";
// import { BookingHeader } from "./booking-header";
// import { BookingPagination } from "./booking-pagination";
import { BookingTable } from "./booking-table";

// Sample data
// const initialBookings: any[] = [
//   {
//     id: "10150",
//     name: "Raza Babu",
//     category: "Hourly",
//     room: "Dungeon Room",
//     numberOfPeople: 2,
//     services: "M-F 3hrs 12-6pm",
//     date: "10/05/2025",
//     time: "12:00pm - 3:00pm",
//     amount: "$58",
//     status: "confirmed",
//   },
//   {
//     id: "10150",
//     name: "Raza Babu",
//     category: "Hourly",
//     room: "Dungeon Room",
//     numberOfPeople: 5,
//     services: "M-F 3hrs 12-6pm",
//     date: "10/05/2025",
//     time: "12:00pm - 3:00pm",
//     amount: "$58",
//     status: "canceled",
//   },
//   {
//     id: "10150",
//     name: "Raza Babu",
//     category: "Hourly",
//     room: "Dungeon Room",
//     numberOfPeople: 1,
//     services: "M-F 3hrs 12-6pm",
//     date: "10/05/2025",
//     time: "12:00pm - 3:00pm",
//     amount: "$58",
//     status: "refunded",
//   },
// ];

export function BookingManagement() {
  // const [bookings, ] = useState<any[]>(initialBookings);
  // const [currentPage, ] = useState(1);
  // const [itemsPerPage] = useState(10);

  // Update booking status
  // const updateBookingStatus = (id: string, index: number, status: string) => {
  //   const updatedBookings = [...bookings];
  //   updatedBookings[index] = { ...updatedBookings[index], status };
  //   setBookings(updatedBookings);
  // };

  // Calculate pagination
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* <BookingHeader /> */}
      <div className="">
        <BookingTable />
        {/* <BookingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={bookings.length}
          itemsPerPage={itemsPerPage}
          currentItemStart={indexOfFirstItem + 1}
          currentItemEnd={Math.min(indexOfLastItem, bookings.length)}
        /> */}
      </div>
    </div>
  );
}
