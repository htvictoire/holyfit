"use client"

// Helper functions to create toast objects that can be used with the toast() function
export const createToast = {
  success: (title: string, description?: string, duration?: number) => ({
    type: "success" as const,
    title,
    description,
    duration: duration || 3000
  }),

  error: (title: string, description?: string, duration?: number) => ({
    type: "error" as const,
    title,
    description,
    duration: duration || 5000
  }),

  warning: (title: string, description?: string, duration?: number) => ({
    type: "warning" as const,
    title,
    description,
    duration: duration || 4000
  }),

  info: (title: string, description?: string, duration?: number) => ({
    type: "info" as const,
    title,
    description,
    duration: duration || 4000
  }),

  // Special helper for form validation errors
  validation: (errors: Record<string, string[]>) => {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join("; ")

    return {
      type: "error" as const,
      title: "Validation Error",
      description: errorMessages.length > 100 
        ? errorMessages.substring(0, 100) + "..." 
        : errorMessages,
      duration: 6000
    }
  }
}

// Quick access functions for common use cases
export const toastMessages = {
  // Cart related
  addedToCart: (productName: string) => createToast.success(
    "Added to Cart",
    `${productName} has been added to your cart`,
    2000
  ),

  removedFromCart: (productName: string) => createToast.info(
    "Removed from Cart",
    `${productName} has been removed from your cart`,
    2000
  ),

  cartCleared: () => createToast.info(
    "Cart Cleared",
    "All items have been removed from your cart",
    3000
  ),

  // Order related
  orderSuccess: (total: number, method: string) => createToast.success(
    "Order Placed Successfully!",
    `Your order total is $${total.toFixed(2)}. You'll receive confirmation via ${method}.`,
    6000
  ),

  orderError: () => createToast.error(
    "Order Failed",
    "There was an error processing your order. Please try again.",
    5000
  ),

  // Wishlist related
  addedToWishlist: () => createToast.success(
    "Added to Wishlist",
    "Product saved to your wishlist",
    2000
  ),

  // Share related
  linkCopied: () => createToast.success(
    "Link Copied",
    "Product link copied to clipboard",
    2000
  ),

  // Form related
  formValidationError: () => createToast.error(
    "Please fix the errors below",
    "All required fields must be filled correctly",
    4000
  ),

  // Generic messages
  somethingWentWrong: () => createToast.error(
    "Something went wrong",
    "Please try again or contact support if the problem persists",
    5000
  ),

  featureNotAvailable: () => createToast.warning(
    "Feature Coming Soon",
    "This feature is not available yet but will be added soon",
    3000
  )
}
