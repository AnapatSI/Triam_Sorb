import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Brain, TrendingUp } from "lucide-react"
import { User } from "@supabase/supabase-js"

interface HeroProps {
  user: User | null
  language: 'en' | 'th'
}

export default function Hero({ user, language }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="glass-card p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            เรียนรู้อย่างชาญฉลาดด้วย AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            อัปโหลดบทเรียนของคุณ แชร์ความเข้าใจ และรับข้อเสนอแนะจาก AI ที่ปรับแต่งเฉพาะบุคคลเพื่อเร่งการเรียนรู้ของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/learn">
                <Button size="lg" className="glass-button text-lg px-8 py-4">
                  เริ่มเรียนรู้
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="glass-button text-lg px-8 py-4">
                  เข้าสู่ระบบ
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="glass-button text-lg px-8 py-4">
              ดูตัวอย่าง
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">อัปโหลดและประมวลผล</h3>
            <p className="text-gray-600 dark:text-gray-300">
              อัปโหลดไฟล์ PDF, DOCX หรือ TXT ระบบของเราจะสกัดและประมวลผลเนื้อหาของคุณโดยอัตโนมัติ
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">การวิเคราะห์ด้วย AI</h3>
            <p className="text-gray-600 dark:text-gray-300">
              แชร์สิ่งที่คุณเข้าใจ AI ของเราจะวิเคราะห์ความเข้าใจของคุณและระบุช่องว่างของความรู้
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">ติดตามความก้าวหน้า</h3>
            <p className="text-gray-600 dark:text-gray-300">
              ติดตามการเดินทางการเรียนรู้ของคุณด้วยการวิเคราะห์ที่ละเอียดและคำแนะนำที่ปรับแต่งเฉพาะบุคคล
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
