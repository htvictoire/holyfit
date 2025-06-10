"use client"

import { useEffect } from "react"

export default function ApiStatusCheck() {
  useEffect(() => {
    // Check API status silently and store result in localStorage
    const checkApiStatus = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        try {
          const response = await fetch(`${apiUrl}`, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            localStorage.setItem("api_status", "available")
            localStorage.setItem("api_status_last_check", Date.now().toString())
          } else {
            throw new Error(`API returned status: ${response.status}`)
          }
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      } catch (error) {
        localStorage.setItem("api_status", "unavailable")
        localStorage.setItem("api_status_last_check", Date.now().toString())
      }
    }

    // Execute the check
    checkApiStatus()
  }, [])

  // No UI rendered
  return null
}
