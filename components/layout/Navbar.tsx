"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, BookOpen, Upload, History, MessageSquare } from "lucide-react"

const navigation = [
  { name: "หน้าแรก", href: "/", icon: BookOpen },
  { name: "อัปโหลด", href: "/upload", icon: Upload },
  { name: "เรียนรู้", href: "/learn", icon: MessageSquare },
  { name: "ประวัติ", href: "/history", icon: History },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            TRIAM SORB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/40 dark:bg-white/20 text-black dark:text-white"
                    : "hover:bg-white/20 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button className="glass-button">เข้าสู่ระบบ</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/40 dark:bg-white/20 text-black dark:text-white"
                      : "hover:bg-white/20 dark:hover:bg-white/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
            <div className="pt-2">
              <Button className="w-full glass-button">เข้าสู่ระบบ</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
