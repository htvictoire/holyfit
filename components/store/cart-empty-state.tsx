"use client"

import { ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartEmptyStateProps {
  on_continue_shopping: () => void
}

export function CartEmptyState({ on_continue_shopping }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 mb-6">
        <ShoppingBag className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Your cart is empty
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Add some amazing fitness products to get started on your journey!
      </p>
      <Button 
        onClick={on_continue_shopping}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl px-8"
      >
        Start Shopping
      </Button>
    </div>
  )
}
