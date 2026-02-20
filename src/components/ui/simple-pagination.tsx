"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function SimplePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: SimplePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const currentItemCount = Math.min(
    itemsPerPage,
    totalItems - (currentPage - 1) * itemsPerPage
  );

  return (
    <div className="flex justify-between items-center px-5 py-3">
      <div className="text-center text-gray-600 my-4">
        {totalItems === 0 ? (
          "No items available."
        ) : (
          <>
            Showing <span className="font-semibold">{currentItemCount}</span> of{" "}
            <span className="font-semibold">{totalItems}</span> bookings — Page{" "}
            <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </>
        )}
      </div>

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded border ${
                currentPage === pageNum
                  ? "bg-[#FF6900] text-white border-[#FF6900]"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
