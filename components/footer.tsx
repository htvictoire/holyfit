"use client"

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, ArrowUp } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">HolyFit</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Transforming lives since day 1. Succeed in your health and fitness journey with personalized training and
              nutrition plans.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: "#" },
                { icon: <Twitter className="h-4 w-4" />, href: "#" },
                { icon: <Instagram className="h-4 w-4" />, href: "#" },
                { icon: <Linkedin className="h-4 w-4" />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-md hover:bg-white/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#hero" },
                { name: "About", href: "#about-me" },
                { name: "Services", href: "#our-services" },
                { name: "Pricing", href: "#our-pricing" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "#contact-us" },
              ].map((link, index) => (
                <li key={index}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {[
                { name: "Personal Training", href: "#" },
                { name: "Nutrition Plans", href: "#" },
                { name: "Accountability Partners", href: "#" },
                { name: "Workout Plans", href: "#" },
                { name: "Fitness Coaching", href: "#" },
              ].map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 text-red-500 mt-1" />
                <a href="tel:+447858482413" className="text-gray-400 hover:text-white transition-colors text-sm">
                  +447858482413
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 text-red-500 mt-1" />
                <a href="mailto:info@holyfit.co.uk" className="text-gray-400 hover:text-white transition-colors text-sm">
                  info@holyfit.co.uk
                </a>
              </li>
            </ul>

            <div className="mt-6 bg-white/5 p-4 rounded-md">
              <h5 className="font-medium mb-2 text-sm text-white">Subscribe to our newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border border-white/20 rounded-l-md px-3 py-2 text-xs w-full focus:outline-none focus:border-red-500 text-white"
                />
                <button className="bg-red-500 text-white px-3 py-2 rounded-r-md text-xs">Send</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs mb-4 md:mb-0">&copy; {currentYear} HolyFit. All rights reserved.</p>
            <div className="flex space-x-4">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" },
              ].map((link, index) => (
                <a key={index} href={link.href} className="text-gray-400 hover:text-white text-xs transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button - simplified */}
      <button
        className="absolute bottom-8 right-8 bg-red-500 text-white p-2 rounded-md shadow-sm hover:bg-red-600 transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  )
}
