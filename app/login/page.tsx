"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabaseApi } from "@/lib/supabase"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabaseApi.signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 dark:bg-black">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white dark:text-black" />
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            เข้าสู่ระบบ
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
            เข้าสู่ระบบเพื่อเริ่มต้นการเรียนรู้และติดตามความก้าวหน้าของคุณ
          </p>
        </div>
        <Card className="glass-card w-full">
          <CardHeader>
            <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="glass"
              />
              <Input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="glass"
              />
              {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/30 rounded-lg py-2 px-3">{error}</div>}
              <Button type="submit" className="w-full glass-button text-lg" disabled={loading}>
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
              <div className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
                ยังไม่มีบัญชี? <a href="/signup" className="underline hover:text-primary transition-colors">สมัครสมาชิก</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 