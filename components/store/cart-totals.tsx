"use client"

import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Cart } from "@/types/store-types"

interface CartTotalsProps {
  cart: Cart
  on_continue_shopping: () => void
  on_checkout: () => void
}

export function CartTotals({ cart, on_continue_shopping, on_checkout }: CartTotalsProps) {
  return (
    <div className="border-t border-gray-200 bg-white p-4 space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span className="font-semibold">${cart.tax?.toFixed(2) || "0.00"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {cart.shipping === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              <span className="text-gray-800">${cart.shipping?.toFixed(2) || "0.00"}</span>
            )}
          </span>
        </div>

        {cart.subtotal < 50 && cart.shipping! > 0 && (
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-blue-700">
              Add ${(50 - cart.subtotal).toFixed(2)} more for FREE shipping! 🚚
            </p>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={on_continue_shopping}
          className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
        >
          Continue Shopping
        </Button>
        <Button onClick={on_checkout} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          <CreditCard className="w-4 h-4 mr-2" />
          Checkout
        </Button>
      </div>
    </div>
  )
}
