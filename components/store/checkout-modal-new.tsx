"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useStoreState } from "@/store/store-store"
import { CreditCard, MessageSquare, Mail, User, MapPin, ShoppingBag, CheckCircle, X, Package, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"

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

export function CheckoutModalNew() {
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
          .map((item) => `• ${item.product.name} (x${item.quantity}) - $${(Number(item.total_price) || 0).toFixed(2)}`)
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

*Total: $${(Number(cart.total) || 0).toFixed(2)}*

${data.notes ? `Notes: ${data.notes}` : ""}
        `.trim()

        const whatsapp_number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
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
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 border-b border-blue-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg p-1">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-white">
                    <h1 className="text-lg font-bold">Secure Checkout</h1>
                    <p className="text-blue-100 text-xs">Complete your order</p>
                  </div>
                </div>
                <Button
                  onClick={toggle_checkout}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 space-y-6">
                {/* Order Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-800">Order Summary</h2>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">{cart.total_items} items</Badge>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 line-clamp-1 text-xs">
                            {item.product.name}
                          </h4>
                          {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(item.selected_variants).map(([type, value]) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-semibold text-gray-800 text-xs">${(Number(item.total_price) || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${(Number(cart.subtotal) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${cart.tax?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {cart.shipping === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          `$${cart.shipping?.toFixed(2) || "0.00"}`
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">${(Number(cart.total) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Checkout Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(on_submit)} className="space-y-4">
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-semibold text-gray-800">Customer Information</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-700">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
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
                              <FormLabel className="text-xs font-medium text-gray-700">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-700">Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
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
                              <FormLabel className="text-xs font-medium text-gray-700">Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <h3 className="text-sm font-semibold text-gray-800">Shipping Address</h3>
                      </div>

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-700">Street Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-700">City</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
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
                              <FormLabel className="text-xs font-medium text-gray-700">ZIP Code</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Delivery Method */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-800">Delivery Method</h3>
                      <RadioGroup
                        value={delivery_method}
                        onValueChange={(value: "whatsapp" | "email") => set_delivery_method(value)}
                        className="space-y-2"
                      >
                        <div className="relative">
                          <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                          <Label
                            htmlFor="whatsapp"
                            className={cn(
                              "flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all",
                              delivery_method === "whatsapp"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300 bg-white"
                            )}
                          >
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center",
                                delivery_method === "whatsapp" ? "border-green-500 bg-green-500" : "border-gray-300"
                              )}
                            >
                              {delivery_method === "whatsapp" && <div className="w-1 h-1 bg-white rounded-full" />}
                            </div>
                            <div className="bg-green-500 rounded-lg p-1 mr-2">
                              <MessageSquare className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-xs">WhatsApp</div>
                              <div className="text-xs text-gray-600">Instant confirmation</div>
                            </div>
                            <Badge className="bg-green-500 text-white text-xs">Fast</Badge>
                          </Label>
                        </div>

                        <div className="relative">
                          <RadioGroupItem value="email" id="email" className="sr-only" />
                          <Label
                            htmlFor="email"
                            className={cn(
                              "flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all",
                              delivery_method === "email"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300 bg-white"
                            )}
                          >
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center",
                                delivery_method === "email" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              )}
                            >
                              {delivery_method === "email" && <div className="w-1 h-1 bg-white rounded-full" />}
                            </div>
                            <div className="bg-blue-500 rounded-lg p-1 mr-2">
                              <Mail className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-xs">Email</div>
                              <div className="text-xs text-gray-600">Traditional confirmation</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Order Notes */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-gray-700">Order Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Any special instructions..."
                                rows={2}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none rounded-lg text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Truck className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700">Free Ship</span>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700">Secure</span>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Package className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                        <span className="text-xs font-medium text-gray-700">Quality</span>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50/50 p-4">
              <div className="space-y-3">
                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={is_submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 disabled:opacity-50"
                  onClick={form.handleSubmit(on_submit)}
                >
                  {is_submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Complete Order - ${(Number(cart.total) || 0).toFixed(2)}
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggle_checkout}
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}