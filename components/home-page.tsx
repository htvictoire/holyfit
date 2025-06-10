"use client"

import { useEffect, useState } from "react"
import { useHomeStore } from "@/store/home-store"
import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import ServicesSection from "@/components/sections/services-section"
import PricingSection from "@/components/sections/pricing-section"
import PotentialSection from "@/components/sections/potential-section"
import ExpertiseSection from "@/components/sections/expertise-section"
import VideoSection from "@/components/sections/video-section"
import ContactSection from "@/components/sections/contact-section"
import FaqSection from "@/components/sections/faq-section"
import LoadingSpinner from "@/components/ui/loading-spinner"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const { data, loading, error, fetchHomeData } = useHomeStore()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      fetchHomeData()
    } catch (error) {
      console.error("Error in fetchHomeData:", error)
    }
  }, [fetchHomeData])

  useEffect(() => {
    if (data && !loading) {
      // Simulate loading for better UX
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [data, loading])

  if (loading || !isLoaded) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => fetchHomeData()}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation />
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} />
        <ServicesSection data={data.services} />
        <PricingSection data={data.pricing} />
        <PotentialSection data={data.potential} />
        <ExpertiseSection data={data.expertise} />
        <VideoSection data={data.video_section} />
        <ContactSection data={data.contact} />
        <FaqSection data={data.faq} />
        <Footer />
        <ScrollToTop />
      </motion.div>
    </AnimatePresence>
  )
}
