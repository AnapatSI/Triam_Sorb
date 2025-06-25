"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, BookOpen, Upload, History, MessageSquare, User, Home } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { useLanguage } from "@/components/LanguageProvider"
import { useTranslation } from "@/hooks/useTranslation"

const navigation = [
  { key: "home", href: "/", icon: Home },
  // { key: "learn", href: "/learn", icon: BookOpen },
  { key: "upload", href: "/upload", icon: Upload },
  { key: "history", href: "/history", icon: History },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()
  const t = useTranslation()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleLanguageChange = (lang: 'en' | 'th') => setLanguage(lang)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 pt-2 pb-2 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            TRIAM SORB
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            let label = ""
            switch (item.key) {
              case "home":
                label = t.common?.home || "หน้าแรก"
                break
              // case "learn":
              //   label = t.common?.learn || "เรียนรู้"
              //   break
              case "upload":
                label = t.common?.upload || "อัปโหลด"
                break
              case "history":
                label = t.common?.history || "ประวัติ"
                break
              default:
                label = item.key
            }
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/40 dark:bg-white/30 text-black dark:text-white"
                    : "hover:bg-white/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </Link>
            )
          })}
        </div>



        <div className="hidden md:flex items-center space-x-4">
          <button
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
            onClick={() => handleLanguageChange(language === 'en' ? 'th' : 'en')}
          >
            {language === 'en' ? (
              <img src="/united-kingdom.png" alt="English" className="w-5 h-5 rounded-5" />
            ) : (
              <img src="/thailand.png" alt="ไทย" className="w-5 h-5 rounded-5" />
            )}
            <span>→</span>
            {language === 'en' ? (
              <img src="/thailand.png" alt="ไทย" className="w-5 h-5 rounded-5 opacity-70" />
            ) : (
              <img src="/united-kingdom.png" alt="English" className="w-5 h-5 rounded-5 opacity-70" />
            )}
          </button>
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white">
                  <User className="w-4 h-4" />
                  {/* <span className="text-sm">{user.email}</span> */}
                </Button>
              </Link>
              {/* <Button className="glass-button" onClick={handleSignOut} disabled={loading}>
                ออกจากระบบ
              </Button> */}
            </>
          ) : (
            <Button className="glass-button" asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass rounded-xl text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          {/* Mobile Language Buttons */}
          <div className="flex flex-col gap-2 mb-4">
            <button
              className={`w-full px-4 py-2 rounded flex items-center gap-2 ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleLanguageChange('en')}
            >
              <img src="/united-kingdom.png" alt="English" className="w-5 h-5 rounded-full" />
              EN
            </button>
            <button
              className={`w-full px-4 py-2 rounded flex items-center gap-2 ${language === 'th' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleLanguageChange('th')}
            >
              <img src="/thailand.png" alt="ไทย" className="w-5 h-5 rounded-full" />
              TH
            </button>
          </div>
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              let label = ""
              switch (item.key) {
                case "home":
                  label = t.common?.home || "หน้าแรก"
                  break
                // case "learn":
                //   label = t.common?.learn || "เรียนรู้"
                //   break
                case "upload":
                  label = t.common?.upload || "อัปโหลด"
                  break
                case "history":
                  label = t.common?.history || "ประวัติ"
                  break
                default:
                  label = item.key
              }
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/40 dark:bg-white/30 text-black dark:text-white"
                      : "hover:bg-white/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">แดชบอร์ด</span>
              </Link>
            )}
            <div className="pt-2">
              {user ? (
                <Button className="w-full glass-button" onClick={handleSignOut} disabled={loading}>
                  ออกจากระบบ
                </Button>
              ) : (
                <Button className="w-full glass-button" asChild>
                  <Link href="/login">เข้าสู่ระบบ</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
