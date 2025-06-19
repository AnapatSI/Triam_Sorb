import { Upload, Edit, Brain, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "อัปโหลดบทเรียนของคุณ",
    description: "อัปโหลดไฟล์ PDF, DOCX หรือ TXT ที่มีเนื้อหาการศึกษาของคุณ",
    step: "01",
  },
  {
    icon: Edit,
    title: "แชร์ความเข้าใจของคุณ",
    description: "เขียนสิ่งที่คุณเข้าใจจากบทเรียนด้วยคำพูดของคุณเอง",
    step: "02",
  },
  {
    icon: Brain,
    title: "รับข้อเสนอแนะจาก AI",
    description: "รับการวิเคราะห์ที่ละเอียดที่เน้นพื้นที่ที่ต้องปรับปรุง",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "ติดตามความก้าวหน้าของคุณ",
    description: "ติดตามการเดินทางการเรียนรู้ของคุณและดูการปรับปรุงของคุณเมื่อเวลาผ่านไป",
    step: "04",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            วิธีการทำงาน
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ขั้นตอนง่ายๆ ในการเปลี่ยนแปลงประสบการณ์การเรียนรู้ของคุณด้วยข้อเสนอแนะที่ขับเคลื่อนด้วย AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="glass-card p-8 text-center relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
