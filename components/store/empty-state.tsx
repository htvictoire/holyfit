"use client"

import { ShoppingBag, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  on_clear_filters: () => void
}

export function EmptyState({ on_clear_filters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-full p-8 mb-6">
        <ShoppingBag className="h-16 w-16 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our
        categories.
      </p>
      <Button
        onClick={on_clear_filters}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  )
}
