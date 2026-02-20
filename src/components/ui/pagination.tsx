// import * as React from "react"
// import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { ButtonProps, buttonVariants } from "@/components/ui/button"

// const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
//   <nav
//     role="navigation"
//     aria-label="pagination"
//     className={cn("mx-auto flex w-full justify-center", className)}
//     {...props}
//   />
// )
// Pagination.displayName = "Pagination"

// const PaginationContent = React.forwardRef<
//   HTMLUListElement,
//   React.ComponentProps<"ul">
// >(({ className, ...props }, ref) => (
//   <ul
//     ref={ref}
//     className={cn("flex flex-row items-center gap-1", className)}
//     {...props}
//   />
// ))
// PaginationContent.displayName = "PaginationContent"

// const PaginationItem = React.forwardRef<
//   HTMLLIElement,
//   React.ComponentProps<"li">
// >(({ className, ...props }, ref) => (
//   <li ref={ref} className={cn("", className)} {...props} />
// ))
// PaginationItem.displayName = "PaginationItem"

// type PaginationLinkProps = {
//   isActive?: boolean
// } & Pick<ButtonProps, "size"> &
//   React.ComponentProps<"a">

// const PaginationLink = ({
//   className,
//   isActive,
//   size = "icon",
//   ...props
// }: PaginationLinkProps) => (
//   <a
//     aria-current={isActive ? "page" : undefined}
//     className={cn(
//       buttonVariants({
//         variant: isActive ? "outline" : "ghost",
//         size,
//       }),
//       className
//     )}
//     {...props}
//   />
// )
// PaginationLink.displayName = "PaginationLink"

// const PaginationPrevious = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to previous page"
//     size="default"
//     className={cn("gap-1 pl-2.5", className)}
//     {...props}
//   >
//     <ChevronLeft className="h-4 w-4" />
//     <span>Previous</span>
//   </PaginationLink>
// )
// PaginationPrevious.displayName = "PaginationPrevious"

// const PaginationNext = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to next page"
//     size="default"
//     className={cn("gap-1 pr-2.5", className)}
//     {...props}
//   >
//     <span>Next</span>
//     <ChevronRight className="h-4 w-4" />
//   </PaginationLink>
// )
// PaginationNext.displayName = "PaginationNext"

// const PaginationEllipsis = ({
//   className,
//   ...props
// }: React.ComponentProps<"span">) => (
//   <span
//     aria-hidden
//     className={cn("flex h-9 w-9 items-center justify-center", className)}
//     {...props}
//   >
//     <MoreHorizontal className="h-4 w-4" />
//     <span className="sr-only">More pages</span>
//   </span>
// )
// PaginationEllipsis.displayName = "PaginationEllipsis"

// export {
//   Pagination,
//   PaginationContent,
//   PaginationLink,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationNext,
//   PaginationEllipsis,
// }


"use client"
 
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
 
interface PaginationProps {
  currentPage: number
  totalResults: number
  resultsPerPage: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
}
 
export function Pagination({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
  showPageNumbers = true,
}: PaginationProps) {
  // Handle edge cases
  const safeCurrentPage = Math.max(1, currentPage || 1)
  const safeTotalResults = Math.max(0, totalResults || 0)
  const safeResultsPerPage = Math.max(1, resultsPerPage || 10)
 
  const totalPages = Math.ceil(safeTotalResults / safeResultsPerPage)
  const startResult = safeTotalResults === 0 ? 0 : (safeCurrentPage - 1) * safeResultsPerPage + 1
  const endResult = Math.min(safeCurrentPage * safeResultsPerPage, safeTotalResults)
 
  // Create an array of page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
 
    // Handle cases with more than 5 pages
    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, 5]
    }
 
    if (safeCurrentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
 
    return [safeCurrentPage - 2, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, safeCurrentPage + 2]
  }
 
  const pageNumbers = getPageNumbers()
 
  return (
    <div className="flex items-center justify-between w-full px-[26px] py-[13px] ">
      <div className="font-poppins text-base font-light text-[#374151] tracking-[0%] leading-[15px]">
        Showing <span className="font-medium">{startResult}</span> to <span className="font-medium">{endResult}</span>{" "}
        of <span className="font-medium">{totalResults}</span> results
      </div>
 
      {showPageNumbers && totalPages > 1 && (
        <div className="flex items-center border border-[#E5E7EB] rounded-[7px]">
          <button
            onClick={() => safeCurrentPage > 1 && onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className={cn(
              "py-[13px] px-[10px] border-r",
              safeCurrentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100",
            )}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
 
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-[46px] h-[50px] text-base font-poppins text-[#374151] font-medium leading-[120%] tracking-[0%] border-r border-[#D1D5DB]",
                safeCurrentPage === page ? "bg-[#FF69001A]/10 text-[#FF6900]" : "hover:bg-gray-100",
              )}
              aria-label={`Page ${page}`}
              aria-current={safeCurrentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}
 
          <button
            onClick={() => safeCurrentPage < totalPages && onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className={cn(
              "py-[13px] px-[10px]",
              safeCurrentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100",
            )}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}
 
export const PaginationContent = () => null
export const PaginationItem = () => null
export const PaginationLink = () => null
export const PaginationEllipsis = () => null
export const PaginationPrevious = () => null
export const PaginationNext = () => null
 
 