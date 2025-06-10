"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Dumbbell, Flame, Heart, Award, BookOpen, HelpCircle, Mail } from "lucide-react"
import { motion, AnimatePresence, useScroll } from "framer-motion"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  const { scrollY } = useScroll()

  // Track scrolling to remove blur when scrolled
  useEffect(() => {
    const unsubscribe = scrollY.onChange((y) => {
      if (y > 50) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    })

    return () => unsubscribe()
  }, [scrollY])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { name: "Home", href: "#hero", icon: <Dumbbell className="h-4 w-4" /> },
    { name: "About", href: "#about-me", icon: <Heart className="h-4 w-4" /> },
    { name: "Services", href: "#our-services", icon: <Flame className="h-4 w-4" /> },
    { name: "Pricing", href: "#our-pricing", icon: <Award className="h-4 w-4" /> },
    { name: "Expertise", href: "#our-expertise", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Contact", href: "#contact-us", icon: <Mail className="h-4 w-4" /> },
    { name: "FAQ", href: "#faq", icon: <HelpCircle className="h-4 w-4" /> },
    { name: "Blog", href: "/blog",},
  ]

  // Animation variants
  const mobileNavVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  }

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className="fixed w-full z-50 transition-all duration-300"
    >
      {/* Background with conditional blur */}
      <motion.div
        className={`absolute inset-0 bg-dark/90 transition-all duration-300 ${hasScrolled ? "" : "backdrop-blur-md"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: hasScrolled ? 1 : 0.7 }}
      />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary rounded-full blur-sm group-hover:blur-md transition-all"></div>
              <div className="relative bg-dark p-2 rounded-full border border-primary/50 group-hover:border-primary transition-all">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <motion.span
              className="text-2xl font-bold text-white ml-3 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Holy
              <span className="text-primary relative">
                Fit
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="flex justify-center items-center">
              <nav className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 font-medium transition-colors rounded-md ${
                      activeSection === link.href.substring(1) ? "text-primary" : "text-white/80 hover:text-white"
                    }`}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {link.name}
                    </span>

                    {/* Active underline */}
                    {activeSection === link.href.substring(1) && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-primary w-full"
                        layoutId="activeTab"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Hover underline (only shows when not active) */}
                    {hoveredLink === link.name && activeSection !== link.href.substring(1) && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-white/50 w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.a>
                ))}
              </nav>
            </div>
          </div>

          {/* Call to action button */}
          <div className="hidden md:block">
            <button
              className="relative overflow-hidden bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-all font-medium"
              onClick={() => {
                document.getElementById("our-pricing")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span className="relative z-10">Get Started</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-10">
            <motion.button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-primary text-white shadow-md"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileNavVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden bg-dark-light/95 backdrop-blur-md absolute top-full left-0 right-0 z-50 rounded-b-lg"
            >
              <div className="py-6 px-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className={`block py-3 px-4 font-medium mb-2 rounded-lg flex items-center gap-3 ${
                      activeSection === link.href.substring(1)
                        ? "bg-primary text-white shadow-md"
                        : "text-white hover:bg-primary/10"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      animate={{
                        rotate: activeSection === link.href.substring(1) ? 360 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={activeSection === link.href.substring(1) ? "text-white" : "text-primary"}
                    >
                      {link.icon}
                    </motion.div>
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  className="pt-4"
                  custom={navLinks.length}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <button
                    className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium"
                    onClick={() => {
                      document.getElementById("our-pricing")?.scrollIntoView({ behavior: "smooth" })
                      setIsOpen(false)
                    }}
                  >
                    Get Started
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
        style={{
          width: "100%",
        }}
      />
    </motion.nav>
  )
}
