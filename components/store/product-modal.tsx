"use client"

import { useState, useEffect } from "react"
import { useStoreState } from "@/store/store-store"
import { Star, ShoppingCart, Heart, Share, Package, Truck, Shield, RefreshCw, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/store-types"

interface ProductModalProps {
  product: Product
  is_open: boolean
  on_close: () => void
}

export function ProductModal({ product, is_open, on_close }: ProductModalProps) {
  const { add_to_cart } = useStoreState()
  const { toast } = useToast()
  const [selected_variants, set_selected_variants] = useState<Record<string, string>>({})
  const [quantity, set_quantity] = useState(1)
  const [current_image_index, set_current_image_index] = useState(0)
  const [is_adding_to_cart, set_is_adding_to_cart] = useState(false)

  const images = product.images || [product.image]

  const calculate_price = () => {
    let price = Number(product.price) || 0
    if (product.variants && selected_variants) {
      for (const [variant_type, selected_value] of Object.entries(selected_variants)) {
        const variant = product.variants.find((v) => v.type === variant_type && v.value === selected_value)
        if (variant?.price_modifier) {
          price += Number(variant.price_modifier)
        }
      }
    }
    return price
  }

  const handle_variant_change = (variant_type: string, value: string) => {
    set_selected_variants((prev) => ({
      ...prev,
      [variant_type]: value,
    }))
  }

  const handle_add_to_cart = async () => {
    if (product.variants) {
      const variant_types = [...new Set(product.variants.map((v) => v.type))]
      const missing_variants = variant_types.filter((type) => !selected_variants[type])

      if (missing_variants.length > 0) {
        toast({
          title: "Selection Required",
          description: `Please select: ${missing_variants.join(", ")}`,
          variant: "destructive",
        })
        return
      }
    }

    set_is_adding_to_cart(true)

    try {
      add_to_cart(product, quantity, selected_variants)

      toast({
        title: "Added to Cart! 🎉",
        description: `${product.name} (${quantity}x) has been added to your cart`,
        duration: 3000,
      })

      // Close modal after successful add
      setTimeout(() => {
        on_close()
      }, 500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      set_is_adding_to_cart(false)
    }
  }

  const variants_by_type =
    product.variants?.reduce(
      (acc, variant) => {
        if (!acc[variant.type]) {
          acc[variant.type] = []
        }
        acc[variant.type].push(variant)
        return acc
      },
      {} as Record<string, typeof product.variants>,
    ) || {}

  const total_price = calculate_price() * quantity

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (is_open) {
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
  }, [is_open])

  return (
    <AnimatePresence>
      {is_open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={on_close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Right Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-6xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-1 text-sm flex-shrink-0">
                  {product.category.name}
                </Badge>
                <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
              </div>
              <Button
                onClick={on_close}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                {/* Product Images */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-4">
                  <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl lg:rounded-2xl bg-white shadow-lg">
                      <img
                        src={images[current_image_index] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Floating badges */}
                      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 space-y-2 sm:space-y-3">
                        {product.original_price && (
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold">
                            SALE
                          </Badge>
                        )}
                        {product.rating && product.rating >= 4.5 && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-current" />
                            TOP RATED
                          </Badge>
                        )}
                      </div>
                    </div>

                    {images.length > 1 && (
                      <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => set_current_image_index(index)}
                            className={cn(
                              "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl border-2 sm:border-3 overflow-hidden transition-all duration-300",
                              index === current_image_index
                                ? "border-purple-500 shadow-lg scale-105"
                                : "border-gray-200 hover:border-purple-300 hover:scale-105"
                            )}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-6">
                  {/* Rating and Price */}
                  <div>
                    {product.rating && (
                      <div className="flex items-center mb-4 sm:mb-6">
                        <div className="flex items-center bg-yellow-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 mr-3 sm:mr-4">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4 sm:w-5 sm:h-5",
                                i < Math.floor(product.rating!) ? "text-yellow-500 fill-current" : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-gray-700 font-semibold text-sm sm:text-lg">
                          {product.rating} ({product.review_count} reviews)
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-5xl font-black text-gray-800">${calculate_price().toFixed(2)}</span>
                      {product.original_price && (
                        <>
                          <span className="text-xl sm:text-2xl text-gray-500 line-through">${product.original_price}</span>
                          <Badge className="bg-green-600 text-white px-2 sm:px-3 py-1 text-sm sm:text-lg">
                            Save ${(product.original_price - product.price).toFixed(2)}
                          </Badge>
                        </>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed text-sm sm:text-lg">{product.description}</p>
                  </div>

                  {/* Product Variants */}
                  {Object.keys(variants_by_type).length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">Customize Your Order</h3>
                      {Object.entries(variants_by_type).map(([type, variants]) => (
                        <div key={type}>
                          <Label className="text-sm font-semibold mb-3 block capitalize text-gray-700">
                            {type}:{" "}
                            {selected_variants[type] && (
                              <span className="font-normal text-purple-600">{selected_variants[type]}</span>
                            )}
                          </Label>
                          <RadioGroup
                            value={selected_variants[type] || ""}
                            onValueChange={(value) => handle_variant_change(type, value)}
                            className="flex flex-wrap gap-2 sm:gap-3"
                          >
                            {variants.map((variant) => (
                              <div key={variant.id} className="flex items-center">
                                <RadioGroupItem value={variant.value} id={variant.id} className="sr-only" />
                                <Label
                                  htmlFor={variant.id}
                                  className={cn(
                                    "cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-2 rounded-lg sm:rounded-xl transition-all duration-300",
                                    selected_variants[type] === variant.value
                                      ? "border-purple-500 bg-purple-500 text-white shadow-lg scale-105"
                                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                                  )}
                                >
                                  {variant.value}
                                  {variant.price_modifier && (
                                    <span className="ml-1 sm:ml-2 text-xs opacity-75">(+${variant.price_modifier})</span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Stock */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div>
                        <Label className="text-sm font-semibold mb-3 block text-gray-700">Quantity</Label>
                        <div className="flex items-center bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => set_quantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-none hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <span className="text-lg sm:text-xl font-bold px-4 sm:px-6 min-w-12 sm:min-w-16 text-center bg-gray-50">{quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => set_quantity(quantity + 1)}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-none hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="text-left sm:text-right">
                        {product.in_stock ? (
                          <div className="flex items-center sm:justify-end">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <div>
                              <span className="text-sm font-bold text-green-700 block">✅ In Stock</span>
                              {product.stock_quantity && (
                                <span className="text-xs text-gray-500">{product.stock_quantity} available</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center sm:justify-end">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <span className="text-sm font-bold text-red-700">❌ Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      onClick={handle_add_to_cart}
                      disabled={!product.in_stock || is_adding_to_cart}
                      className="flex-1 h-12 sm:h-14 text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl sm:rounded-2xl shadow-xl disabled:opacity-50"
                    >
                      {is_adding_to_cart ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                          Adding...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                          Add to Cart - ${total_price.toFixed(2)}
                        </>
                      )}
                    </Button>

                    <div className="flex space-x-3 sm:space-x-0">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none h-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border-gray-300 hover:bg-gray-50"
                      >
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none h-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border-gray-300 hover:bg-gray-50"
                      >
                        <Share className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="bg-blue-500 rounded-full p-1.5 sm:p-2">
                        <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-blue-700">Free shipping over $50</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="bg-green-500 rounded-full p-1.5 sm:p-2">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-green-700">Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="bg-orange-500 rounded-full p-1.5 sm:p-2">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-orange-700">30-day returns</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="bg-purple-500 rounded-full p-1.5 sm:p-2">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="font-semibold text-purple-700">Quality guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-gray-200 bg-gray-50/50 p-4 sm:p-6 lg:p-8">
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl sm:rounded-2xl p-1 sm:p-2 h-12 sm:h-14 shadow-sm">
                    <TabsTrigger value="features" className="rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg">
                      Features
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg">
                      Specs
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg">
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Key Features</h3>
                      {product.features ? (
                        <div className="grid gap-3 sm:gap-4">
                          {product.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 sm:space-x-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 sm:mt-3 flex-shrink-0" />
                              <span className="text-gray-700 leading-relaxed text-sm sm:text-lg">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm sm:text-lg">No features listed for this product.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Specifications</h3>
                      {product.specifications ? (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                                <span className="font-semibold text-gray-800 text-sm sm:text-lg">{key}:</span>
                                <span className="text-gray-600 font-medium text-sm sm:text-lg">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm sm:text-lg">No specifications available for this product.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Customer Reviews</h3>
                        {product.rating && (
                          <div className="flex items-center space-x-2 sm:space-x-3 bg-yellow-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4 sm:w-5 sm:h-5",
                                    i < Math.floor(product.rating!) ? "text-yellow-500 fill-current" : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm sm:text-lg">
                              {product.rating} out of 5 ({product.review_count} reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl sm:rounded-2xl">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Reviews Coming Soon!</h4>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg">Be the first to review this amazing product.</p>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg sm:rounded-xl px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg">
                          Write a Review
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
