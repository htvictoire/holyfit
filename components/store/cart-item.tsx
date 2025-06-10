"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CartItem as CartItemType } from "@/types/store-types"

interface CartItemProps {
  item: CartItemType
  on_update_quantity: (id: string, quantity: number) => void
  on_remove: (id: string) => void
}

export function CartItem({ item, on_update_quantity, on_remove }: CartItemProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-3">
        <div className="relative">
          <img
            src={item.product.image || "/placeholder.svg"}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          {item.product.original_price && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
              !
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 line-clamp-2 mb-1 text-sm">{item.product.name}</h4>

          {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {Object.entries(item.selected_variants).map(([type, value]) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                >
                  {value}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded-l-lg hover:bg-gray-200"
                  onClick={() => on_update_quantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>

                <span className="text-sm font-semibold px-2 min-w-6 text-center">{item.quantity}</span>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded-r-lg hover:bg-gray-200"
                  onClick={() => on_update_quantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-800">${item.total_price.toFixed(2)}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                onClick={() => on_remove(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
