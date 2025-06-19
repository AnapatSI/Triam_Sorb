import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            พร้อมที่จะเปลี่ยนแปลงการเรียนรู้ของคุณหรือยัง?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับผู้เรียนหลายพันคนที่กำลังใช้ AI เพื่อเร่งการศึกษาของพวกเขาและบรรลุผลลัพธ์ที่ดีกว่า
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="glass-button text-lg px-8 py-4">
                เริ่มเรียนรู้ตอนนี้
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="glass-button text-lg px-8 py-4">
              เรียนรู้เพิ่มเติม
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
