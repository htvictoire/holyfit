"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  nextPageUrl?: string | null;
  prevPageUrl?: string | null;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  nextPageUrl,
  prevPageUrl
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return

    onPageChange(page)

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())

    // Add size parameter if a pageSize was provided
    if (pageSize !== 10) {
      params.set("size", pageSize.toString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1)
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div
      className="flex items-center justify-center space-x-2 mt-10 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: "0.2s" }}
    >
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || !prevPageUrl}
        aria-label="First page"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || !prevPageUrl}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, index) =>
        page < 0 ? (
          <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              currentPage === page ? "bg-primary text-white font-medium" : "border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !nextPageUrl}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || !nextPageUrl}
        aria-label="Last page"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  )
}
