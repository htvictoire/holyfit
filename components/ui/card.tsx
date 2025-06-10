import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "fitness" | "premium" | "gradient" | "glass" | "dark"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:
      "rounded-xl bg-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col",
    fitness:
      "rounded-xl bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden",
    premium:
      "rounded-xl bg-white border border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col",
    gradient:
      "rounded-xl bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col",
    glass:
      "rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col",
    dark: "rounded-xl bg-gray-900 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col text-white",
  }

  return <div ref={ref} className={cn(variants[variant], "min-h-0", className)} {...props} />
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 border-b border-gray-100/50", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-xl font-bold leading-tight tracking-tight text-gray-900", className)}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-4 flex-1 flex flex-col justify-between", className)} {...props} />
  ),
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center px-6 pb-6", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
