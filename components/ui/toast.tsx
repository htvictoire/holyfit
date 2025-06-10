"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// Toast types
type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// Custom hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto dismiss after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Individual Toast Component
interface ToastComponentProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastComponent({ toast, onDismiss }: ToastComponentProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isExiting, setIsExiting] = React.useState(false)

  React.useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 200)
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    const base = "border-l-4"
    switch (toast.type) {
      case "success":
        return `${base} border-green-500 bg-green-50`
      case "error":
        return `${base} border-red-500 bg-red-50`
      case "warning":
        return `${base} border-yellow-500 bg-yellow-50`
      case "info":
        return `${base} border-blue-500 bg-blue-50`
      default:
        return `${base} border-blue-500 bg-blue-50`
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 transform pointer-events-auto",
        getStyles(),
        isVisible && !isExiting 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm">
          {toast.title}
        </div>
        {toast.description && (
          <div className="text-gray-600 text-sm mt-1">
            {toast.description}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  )
}

// Convenience functions
export function successToast(title: string, description?: string) {
  // These will be used with the hook in components
  return { type: "success" as const, title, description }
}

export function errorToast(title: string, description?: string) {
  return { type: "error" as const, title, description }
}

export function warningToast(title: string, description?: string) {
  return { type: "warning" as const, title, description }
}

export function infoToast(title: string, description?: string) {
  return { type: "info" as const, title, description }
}
