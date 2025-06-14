"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useStoreState } from "@/store/store-store"
import { CreditCard, MessageSquare, Mail, User, MapPin, ShoppingBag, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const checkout_schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkout_schema>

export function CheckoutModal() {
  const { cart, is_checkout_open, toggle_checkout, clear_cart } = useStoreState()

  const [is_submitting, set_is_submitting] = useState(false)
  const [delivery_method, set_delivery_method] = useState<"whatsapp" | "email">("whatsapp")

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkout_schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zip_code: "",
      notes: "",
    },
  })

  const on_submit = async (data: CheckoutFormData) => {
    set_is_submitting(true)

    try {
      const order_data = {
        customer: data,
        items: cart.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.total_price,
          variants: item.selected_variants,
        })),
        totals: {
          subtotal: cart.subtotal,
          tax: cart.tax,
          shipping: cart.shipping,
          total: cart.total,
        },
        delivery_method,
        timestamp: new Date().toISOString(),
      }

      if (delivery_method === "whatsapp") {
        const order_summary = cart.items
          .map((item) => `• ${item.product.name} (x${item.quantity}) - $${item.total_price.toFixed(2)}`)
          .join("\n")

        const message = `
🛒 *New Order*

*Customer:*
${data.first_name} ${data.last_name}
${data.email}
${data.phone}
${data.address}, ${data.city} ${data.zip_code}

*Items:*
${order_summary}

*Total: $${cart.total.toFixed(2)}*

${data.notes ? `Notes: ${data.notes}` : ""}
        `.trim()

        const whatsapp_number = "1234567890"
        const whatsapp_url = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(message)}`
        window.open(whatsapp_url, "_blank")
      } else {
        console.log("Order data for email:", order_data)
        alert("Order submitted! We will contact you via email shortly.")
      }

      clear_cart()
      toggle_checkout()
      alert("Order submitted successfully!")
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error submitting your order. Please try again.")
    } finally {
      set_is_submitting(false)
    }
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (is_checkout_open) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }
  }, [is_checkout_open])

  return (
    <AnimatePresence>
      {is_checkout_open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle_checkout}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Right Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col w-full sm:w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] max-w-7xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center text-white">
                <div className="bg-white/20 rounded-lg p-3 mr-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Secure Checkout</h2>
                  <p className="text-blue-100 text-sm sm:text-base">Complete your order securely</p>
                </div>
              </div>
              <Button
                onClick={toggle_checkout}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 xl:grid-cols-3">
                {/* Form Section */}
                <div className="xl:col-span-2 p-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(on_submit)} className="space-y-4 sm:space-y-6">
                      {/* Contact Information */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                          Shipping Address
                        </h3>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="mb-3 sm:mb-4">
                              <FormLabel className="text-gray-700 font-medium text-sm">Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">City</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="zip_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium text-sm">ZIP Code</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Delivery Method */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Delivery Method</h3>
                        <RadioGroup
                          value={delivery_method}
                          onValueChange={(value: "whatsapp" | "email") => set_delivery_method(value)}
                          className="space-y-2 sm:space-y-3"
                        >
                          <div className="relative">
                            <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                            <Label
                              htmlFor="whatsapp"
                              className={cn(
                                "flex items-center cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all",
                                delivery_method === "whatsapp"
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-green-300 bg-white"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center",
                                  delivery_method === "whatsapp" ? "border-green-500 bg-green-500" : "border-gray-300"
                                )}
                              >
                                {delivery_method === "whatsapp" && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div className="bg-green-500 rounded-lg p-1.5 sm:p-2 mr-3">
                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-sm sm:text-base">WhatsApp (Recommended)</div>
                                <div className="text-xs sm:text-sm text-gray-600">Get instant confirmation and updates</div>
                              </div>
                              <Badge className="bg-green-500 text-white text-xs">Fastest</Badge>
                            </Label>
                          </div>

                          <div className="relative">
                            <RadioGroupItem value="email" id="email" className="sr-only" />
                            <Label
                              htmlFor="email"
                              className={cn(
                                "flex items-center cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all",
                                delivery_method === "email"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300 bg-white"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center",
                                  delivery_method === "email" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                )}
                              >
                                {delivery_method === "email" && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div className="bg-blue-500 rounded-lg p-1.5 sm:p-2 mr-3">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-sm sm:text-base">Email</div>
                                <div className="text-xs sm:text-sm text-gray-600">Traditional order confirmation</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Order Notes */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium text-sm">Order Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Any special instructions or notes for your order..."
                                  rows={3}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={toggle_checkout}
                          className="flex-1 h-10 sm:h-12 border-gray-300 hover:bg-gray-50 text-sm sm:text-base"
                        >
                          Back to Cart
                        </Button>
                        <Button
                          type="submit"
                          disabled={is_submitting}
                          className="flex-1 h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm sm:text-base"
                        >
                          {is_submitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2" />
                              Processing...
                            </div>
                          ) : (
                            "Complete Order"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="bg-gray-50 border-t xl:border-t-0 xl:border-l border-gray-200 p-4">
                  <div className="xl:sticky xl:top-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                      Order Summary
                    </h3>

                    <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto mb-3 sm:mb-4">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 line-clamp-1 text-xs sm:text-sm">{item.product.name}</p>
                            {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {Object.entries(item.selected_variants).map(([type, value]) => (
                                  <Badge key={type} variant="secondary" className="text-xs">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-800 text-xs sm:text-sm">${item.total_price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3 sm:my-4" />

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Subtotal</span>
                        <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Tax</span>
                        <span className="font-semibold">${cart.tax?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Shipping</span>
                        <span className="font-semibold">
                          {cart.shipping === 0 ? (
                            <span className="text-green-600 font-bold">FREE</span>
                          ) : (
                            `$${cart.shipping?.toFixed(2) || "0.00"}`
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <span>${cart.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {cart.shipping === 0 && (
                      <div className="mt-3 sm:mt-4 bg-green-100 rounded-lg p-2 sm:p-3 text-center">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2 text-green-600" />
                        <span className="font-semibold text-green-700 text-xs sm:text-sm">Free Shipping Unlocked!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
