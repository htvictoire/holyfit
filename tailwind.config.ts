import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
        heading: ["var(--font-outfit)"],
      },
      colors: {
        // Fitness-inspired colors
        primary: {
          DEFAULT: "#FF4B5C", // Energetic coral red
          light: "#FF7A87",
          dark: "#E63347",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#00C9A7", // Fresh teal
          light: "#2EEBC9",
          dark: "#00A589",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFC045", // Warm yellow
          light: "#FFD47F",
          dark: "#F5A700",
          foreground: "#1A1A1A",
        },
        dark: {
          DEFAULT: "#2D3047", // Deep blue-purple
          light: "#474B6B",
          lighter: "#5F6388",
          foreground: "#FFFFFF",
        },
        light: {
          DEFAULT: "#F9F9F9", // Soft white
          dark: "#F0F0F0",
          darker: "#E6E6E6",
          foreground: "#2D3047",
        },
        // Keep shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      boxShadow: {
        fitness: "0 10px 25px -5px rgba(255, 75, 92, 0.1), 0 8px 10px -6px rgba(255, 75, 92, 0.1)",
        "fitness-hover": "0 20px 35px -10px rgba(255, 75, 92, 0.2), 0 10px 20px -10px rgba(255, 75, 92, 0.2)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-shadow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(255, 75, 92, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 15px rgba(255, 75, 92, 0)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        morph: {
          "0%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%" },
          "100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.1)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(1)" },
        },
        "power-pulse": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sweat-drop": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(20px) scale(0.5)", opacity: "0" },
        },
        "muscle-flex": {
          "0%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(1.03)" },
          "100%": { transform: "scaleX(1)" },
        },
        wave: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(5px) translateY(-5px)" },
          "50%": { transform: "translateX(10px) translateY(0)" },
          "75%": { transform: "translateX(5px) translateY(5px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "grow-shrink": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "rotate-3d": {
          "0%": { transform: "rotateX(0) rotateY(0)" },
          "25%": { transform: "rotateX(5deg) rotateY(5deg)" },
          "50%": { transform: "rotateX(0) rotateY(10deg)" },
          "75%": { transform: "rotateX(-5deg) rotateY(5deg)" },
          "100%": { transform: "rotateX(0) rotateY(0)" },
        },
        "liquid-fill": {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "clip-path-reveal": {
          "0%": { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          "100%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        },
        "diagonal-reveal": {
          "0%": { clipPath: "polygon(0 0, 0 0, 0 0, 0 0)" },
          "100%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-shadow": "pulse-shadow 2s infinite",
        float: "float 3s ease-in-out infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        morph: "morph 8s ease-in-out infinite",
        "text-shimmer": "text-shimmer 2s ease-in-out infinite",
        heartbeat: "heartbeat 2s ease-in-out infinite",
        "power-pulse": "power-pulse 2s ease-in-out infinite",
        "sweat-drop": "sweat-drop 2s ease-in-out infinite",
        "muscle-flex": "muscle-flex 2s ease-in-out infinite",
        wave: "wave 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "grow-shrink": "grow-shrink 3s ease-in-out infinite",
        "rotate-3d": "rotate-3d 7s ease-in-out infinite",
        "liquid-fill": "liquid-fill 2s ease-out forwards",
        ripple: "ripple 1s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-bottom": "slide-in-bottom 0.5s ease-out forwards",
        "slide-in-top": "slide-in-top 0.5s ease-out forwards",
        "clip-path-reveal": "clip-path-reveal 1s ease-out forwards",
        "diagonal-reveal": "diagonal-reveal 1s ease-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-text": "linear-gradient(90deg, #FF4B5C, #00C9A7)",
        "fitness-pattern": "url('/patterns/fitness-pattern.svg')",
        "blob-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z' fill='%23FF4B5C' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        "wave-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 C30 20, 70 0, 100 10 L100 0 L0 0 Z' fill='%2300C9A7' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        "diagonal-lines":
          "repeating-linear-gradient(45deg, rgba(255, 75, 92, 0.05), rgba(255, 75, 92, 0.05) 10px, transparent 10px, transparent 20px)",
        "circuit-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='%23FF4B5C' stroke-width='1' stroke-opacity='0.1' stroke-dasharray='5,5'/%3E%3C/svg%3E\")",
        "muscle-fiber":
          "repeating-linear-gradient(0deg, rgba(0, 201, 167, 0.05), rgba(0, 201, 167, 0.05) 2px, transparent 2px, transparent 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
        ".text-shadow-md": {
          textShadow: "0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
        },
        ".text-shadow-lg": {
          textShadow: "0 15px 30px rgba(0,0,0,0.11), 0 5px 15px rgba(0,0,0,0.08)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
        ".text-gradient": {
          background: "linear-gradient(90deg, #FF4B5C, #00C9A7)",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        ".fitness-blob": {
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        },
        ".fitness-blob-hover": {
          transition: "all 0.5s ease-in-out",
          "&:hover": {
            borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
          },
        },
        ".fitness-underline": {
          position: "relative",
          display: "inline-block",
        },
        ".fitness-underline::after": {
          content: '""',
          position: "absolute",
          bottom: "-5px",
          left: "0",
          width: "100%",
          height: "3px",
          background: "linear-gradient(90deg, #FF4B5C, #00C9A7)",
          borderRadius: "3px",
        },
        ".curved-top": {
          borderTopLeftRadius: "50% 20%",
          borderTopRightRadius: "50% 20%",
        },
        ".curved-bottom": {
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
        },
        ".curved-left": {
          borderTopLeftRadius: "20% 50%",
          borderBottomLeftRadius: "20% 50%",
        },
        ".curved-right": {
          borderTopRightRadius: "20% 50%",
          borderBottomRightRadius: "20% 50%",
        },
        ".clip-triangle": {
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        },
        ".clip-diamond": {
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        },
        ".clip-hexagon": {
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        },
        ".clip-message": {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)",
        },
        ".clip-bevel": {
          clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
        },
        ".perspective": {
          perspective: "1000px",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".glass-effect": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".text-outline": {
          textShadow:
            "-1px -1px 0 rgba(0,0,0,0.2), 1px -1px 0 rgba(0,0,0,0.2), -1px 1px 0 rgba(0,0,0,0.2), 1px 1px 0 rgba(0,0,0,0.2)",
        },
        ".mask-fade-right": {
          maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
        },
        ".mask-fade-bottom": {
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        },
        ".diagonal-split": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #FF4B5C 50%, #00C9A7 50%)",
            zIndex: "-1",
          },
        },
        ".cutout-border": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            border: "2px dashed rgba(255, 75, 92, 0.5)",
            zIndex: "1",
          },
        },
        ".liquid-button": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "0%",
            background: "rgba(255, 255, 255, 0.2)",
            transition: "height 0.5s ease",
            zIndex: "0",
          },
          "&:hover::before": {
            height: "100%",
          },
        },
        ".ripple-effect": {
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "5px",
            height: "5px",
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%) scale(0)",
            opacity: "1",
            transition: "transform 0.6s, opacity 0.6s",
          },
          "&:hover::after": {
            transform: "translate(-50%, -50%) scale(100)",
            opacity: "0",
          },
        },
        ".stacked-layers": {
          position: "relative",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            transition: "all 0.3s ease",
          },
          "&::before": {
            background: "rgba(255, 75, 92, 0.5)",
            transform: "translateY(5px) scale(0.95)",
            zIndex: "-2",
          },
          "&::after": {
            background: "rgba(0, 201, 167, 0.5)",
            transform: "translateY(10px) scale(0.9)",
            zIndex: "-3",
          },
          "&:hover::before": {
            transform: "translateY(10px) scale(0.95)",
          },
          "&:hover::after": {
            transform: "translateY(20px) scale(0.9)",
          },
        },
        ".skewed-background": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "inherit",
            transform: "skewY(-5deg)",
            transformOrigin: "top left",
            zIndex: "-1",
          },
        },
        ".folded-corner": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "0",
            right: "0",
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: "0 30px 30px 0",
            borderColor: "transparent #FF4B5C transparent transparent",
            transition: "all 0.3s ease",
          },
          "&:hover::after": {
            borderWidth: "0 50px 50px 0",
          },
        },
        ".notched-corners": {
          clipPath: "polygon(0% 10%, 10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%)",
        },
        ".zigzag-border": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-10px",
            left: "0",
            width: "100%",
            height: "10px",
            background:
              "linear-gradient(45deg, transparent 33.333%, #FF4B5C 33.333%, #FF4B5C 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #FF4B5C 33.333%, #FF4B5C 66.667%, transparent 66.667%)",
            backgroundSize: "20px 20px",
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
export default config
