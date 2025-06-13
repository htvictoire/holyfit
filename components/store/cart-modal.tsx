"use client"

import { useStoreState } from "@/store/store-store"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartHeader } from "@/components/store/cart-header"
import { CartEmptyState } from "@/components/store/cart-empty-state"
import { CartItem } from "@/components/store/cart-item"
import { CartTotals } from "@/components/store/cart-totals"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function CartModal() {
  const { cart, is_cart_open, toggle_cart, update_cart_item_quantity, remove_from_cart, clear_cart, toggle_checkout } =
    useStoreState()

  const handle_checkout = () => {
    toggle_cart()
    toggle_checkout()
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (is_cart_open) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }
  }, [is_cart_open])

  return (
    <AnimatePresence>
      {is_cart_open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle_cart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Right Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col w-full sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-800">Shopping Cart</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
                </span>
                <Button
                  onClick={toggle_cart}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {cart.items.length === 0 ? (
                <div className="p-4">
                  <CartEmptyState on_continue_shopping={toggle_cart} />
                </div>
              ) : (
                <div className="p-4 space-y-4">
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

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                <CartTotals cart={cart} on_continue_shopping={toggle_cart} on_checkout={handle_checkout} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
