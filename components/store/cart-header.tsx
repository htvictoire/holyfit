"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CartHeaderProps {
  total_items: number
  on_clear_cart: () => void
}

export function CartHeader({ total_items, on_clear_cart }: CartHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
      <DialogHeader className="relative">
        <DialogTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-lg p-2 mr-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <p className="text-blue-100 text-sm">{total_items > 0 ? `${total_items} items` : "Empty cart"}</p>
            </div>
          </div>

          {total_items > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={on_clear_cart}
              className="text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg"
            >
              Clear All
            </Button>
          )}
        </DialogTitle>
      </DialogHeader>
    </div>
  )
}
