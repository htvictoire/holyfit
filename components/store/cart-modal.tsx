"use client"

import { useStoreState } from "@/store/store-store"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CartHeader } from "@/components/store/cart-header"
import { CartEmptyState } from "@/components/store/cart-empty-state"
import { CartItem } from "@/components/store/cart-item"
import { CartTotals } from "@/components/store/cart-totals"

export function CartModal() {
  const { cart, is_cart_open, toggle_cart, update_cart_item_quantity, remove_from_cart, clear_cart, toggle_checkout } =
    useStoreState()

  const handle_checkout = () => {
    toggle_cart()
    toggle_checkout()
  }

  return (
    <Dialog open={is_cart_open} onOpenChange={toggle_cart}>
      <DialogContent className="max-w-lg h-[85vh] flex flex-col p-0 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-2xl rounded-2xl">
        <CartHeader total_items={cart.total_items} on_clear_cart={clear_cart} />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            <CartEmptyState on_continue_shopping={toggle_cart} />
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  on_update_quantity={update_cart_item_quantity}
                  on_remove={remove_from_cart}
                />
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-gray-200/50 bg-gray-50/50">
            <CartTotals cart={cart} on_continue_shopping={toggle_cart} on_checkout={handle_checkout} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
