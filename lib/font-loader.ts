import { Outfit, Poppins } from "next/font/google"

// Outfit for friendly, modern headings - with fallback
export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

// Poppins for friendly, approachable body text - with fallback
export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// Function to get font class names
export function getFontClassName() {
  return `${outfit.variable} ${poppins.variable}`
}
