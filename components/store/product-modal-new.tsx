"use client"

import { useState, useEffect } from "react"
import { useStoreState } from "@/store/store-store"
import { Star, ShoppingCart, Heart, Share, X, Plus, Minus, Shield, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/store-types"

interface ProductModalProps {
  product: Product
  is_open: boolean
  on_close: () => void
}

export function ProductModalNew({ product, is_open, on_close }: ProductModalProps) {
  const { add_to_cart } = useStoreState()
  const { toast } = useToast()
  const [selected_variants, set_selected_variants] = useState<Record<string, string>>({})
  const [quantity, set_quantity] = useState(1)
  const [current_image_index, set_current_image_index] = useState(0)
  const [is_adding_to_cart, set_is_adding_to_cart] = useState(false)
  const [active_tab, set_active_tab] = useState<'overview' | 'specs' | 'reviews'>('specs')

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
          type: "error",
        })
        return
      }
    }

    set_is_adding_to_cart(true)

    try {
      add_to_cart(product, quantity, selected_variants)

      toast({
        title: "Added to Cart! 🎉",
        description: `${product.name} has been added to your cart`,
        type: "success",
        duration: 3000,
      })

      setTimeout(() => {
        on_close()
      }, 500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        type: "error",
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
  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (is_open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
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
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 border-b border-red-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {product.category.name}
                  </Badge>
                  {product.rating && product.rating >= 4.5 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-xs">
                      <Star className="w-2 h-2 mr-1 fill-current" />
                      TOP
                    </Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-white text-red-500 font-bold text-xs">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={on_close}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <h1 className="text-white text-lg font-bold leading-tight">{product.name}</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 space-y-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={images[current_image_index] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800 px-3 py-1">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => set_current_image_index(index)}
                          className={cn(
                            "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                            index === current_image_index
                              ? "border-red-500"
                              : "border-gray-200 hover:border-red-300"
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
                {/* Price & Rating */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-2xl font-bold text-gray-800">
                      ${calculate_price().toFixed(2)}
                    </div>
                    {product.original_price && (
                      <div className="text-lg text-gray-500 line-through">
                        ${product.original_price}
                      </div>
                    )}
                  </div>
                  
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.review_count} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => set_active_tab('specs')}
                      className={cn(
                        "pb-2 text-sm font-medium border-b-2 transition-colors",
                        active_tab === 'specs'
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => set_active_tab('overview')}
                      className={cn(
                        "pb-2 text-sm font-medium border-b-2 transition-colors",
                        active_tab === 'overview'
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => set_active_tab('reviews')}
                      className={cn(
                        "pb-2 text-sm font-medium border-b-2 transition-colors",
                        active_tab === 'reviews'
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Reviews
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {active_tab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                      
                      {product.features && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                          <ul className="space-y-1">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {active_tab === 'specs' && (
                    <div>
                      {product.specifications ? (
                        <div className="space-y-2">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-medium text-gray-700 text-sm">{key}</span>
                              <span className="text-gray-600 text-sm">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No specifications available.</p>
                      )}
                    </div>
                  )}

                  {active_tab === 'reviews' && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">No Reviews Yet</h4>
                      <p className="text-gray-600 mb-3 text-xs">Be the first to review this product.</p>
                      <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        Write a Review
                      </Button>
                    </div>
                  )}
                </div>

                {/* Variants */}
                {Object.keys(variants_by_type).length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(variants_by_type).map(([type, variants]) => (
                      <div key={type}>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block capitalize">
                          {type}: {selected_variants[type] && (
                            <span className="text-red-600 font-normal">{selected_variants[type]}</span>
                          )}
                        </Label>
                        <RadioGroup
                          value={selected_variants[type] || ""}
                          onValueChange={(value) => handle_variant_change(type, value)}
                          className="flex flex-wrap gap-2"
                        >
                          {variants.map((variant) => (
                            <div key={variant.id}>
                              <RadioGroupItem value={variant.value} id={variant.id} className="sr-only" />
                              <Label
                                htmlFor={variant.id}
                                className={cn(
                                  "cursor-pointer px-3 py-1 text-sm font-medium border rounded-lg transition-all",
                                  selected_variants[type] === variant.value
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                                )}
                              >
                                {variant.value}
                                {variant.price_modifier && (
                                  <span className="ml-1 text-xs opacity-75">(+${variant.price_modifier})</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    product.in_stock ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    product.in_stock ? "text-green-600" : "text-red-600"
                  )}>
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.stock_quantity && (
                    <span className="text-xs text-gray-500">({product.stock_quantity} available)</span>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</Label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-32">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => set_quantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-none hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => set_quantity(quantity + 1)}
                      className="h-10 w-10 rounded-none hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
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
                    <RotateCcw className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <span className="text-xs font-medium text-gray-700">30-Day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50/50 p-4">
              <div className="space-y-3">
                {/* Action Buttons */}
                <Button
                  onClick={handle_add_to_cart}
                  disabled={!product.in_stock || is_adding_to_cart}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 disabled:opacity-50"
                >
                  {is_adding_to_cart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart - ${total_price.toFixed(2)}
                    </div>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Wishlist
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <Share className="w-4 h-4 mr-2 text-gray-600" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}