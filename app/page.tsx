import { Suspense } from "react"
import HomePage from "@/components/home-page"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ApiStatusCheck from "@/components/api-status-check"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Add API status check component */}
      <ApiStatusCheck />

      <Suspense fallback={<LoadingSpinner />}>
        <HomePage />
      </Suspense>
    </main>
  )
}
