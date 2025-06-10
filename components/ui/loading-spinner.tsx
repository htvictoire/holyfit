"use client"

import { useEffect, useState } from "react"

export default function LoadingSpinner() {
  const [progress, setProgress] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)

  const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "The hard days are the best because that's when champions are made.",
    "Don't wish for it, work for it.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(quoteInterval)
    }
  }, [motivationalQuotes.length])

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div
          className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          style={{
            transform: `rotate(${progress * 3.6}deg)`,
            transition: "transform 0.1s linear",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
          {progress}%
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">
        Holy<span className="text-primary">Fit</span>
      </h2>
      <p className="text-white/70 mb-6 text-sm">Loading your fitness journey...</p>

      <div className="max-w-md px-6 py-4 bg-white/5 rounded-md">
        <p className="text-white/80 italic text-center text-sm">"{motivationalQuotes[currentQuote]}"</p>
      </div>
    </div>
  )
}
