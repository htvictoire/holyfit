import type React from "react"
import type { Metadata } from "next"
import { Outfit, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SmoothScrollProvider from "@/providers/smooth-scroll-provider"
import { MouseProvider } from "@/hooks/use-mouse"
import ThreeDBackground from "@/components/ui/3d-background"
import { ToastProvider } from "@/components/ui/toast"

// Outfit for friendly, modern headings
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

// Poppins for friendly, approachable body text
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "HolyFit - Transform Your Body, Transform Your Life",
  description:
    "Join HolyFit and unleash your full potential with our personalized training programs, nutrition plans, and expert coaching. Start your fitness journey today!",
  keywords: "fitness, personal training, nutrition, workout plans, health coaching, weight loss, muscle building",
  authors: [{ name: "HolyFit Team" }],
  creator: "HolyFit",
  publisher: "HolyFit",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://holyfit.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HolyFit - Transform Your Body, Transform Your Life",
    description:
      "Join HolyFit and unleash your full potential with personalized training programs and nutrition plans.",
    url: "https://holyfit.co.uk",
    siteName: "HolyFit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HolyFit - Transform Your Body, Transform Your Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HolyFit - Transform Your Body, Transform Your Life",
    description:
      "Join HolyFit and unleash your full potential with personalized training programs and nutrition plans.",
    creator: "@holyfit",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`} style={{ fontFamily: "var(--font-poppins)" }}>
      <body className={`text-gray-900 bg-gray-50`} style={{ fontFamily: "var(--font-poppins)" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MouseProvider>
            <SmoothScrollProvider>
              <ThreeDBackground />
                <ToastProvider>
                  {children}
                </ToastProvider>
            </SmoothScrollProvider>
          </MouseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
