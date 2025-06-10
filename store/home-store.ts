import { create } from "zustand"
import type { HomePageData } from "@/types/home-types"

// Fallback data in case the API fails
import fallbackData from "@/data/fallback-data"

interface HomeStore {
  data: HomePageData | null
  loading: boolean
  error: string | null
  fetchHomeData: () => Promise<void>
}

export const useHomeStore = create<HomeStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchHomeData: async () => {
    try {
      set({ loading: true, error: null })

      // Get the API URL from environment variable or use a default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const endpoint = `${apiUrl}/site-content/home/`

      // Use fetch API with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 seconds timeout

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API error`)
        }

        const data = await response.json()
        set({ data, loading: false })

        // Store API status
        localStorage.setItem("api_status", "available")
        localStorage.setItem("api_status_last_check", Date.now().toString())
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    } catch (error) {
      // Silently fall back to local data without showing errors
      set({
        data: fallbackData as HomePageData,
        loading: false,
        error: null, // No error shown to user
      })
    }
  },
}))
