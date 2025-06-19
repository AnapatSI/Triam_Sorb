import { CheckCircle, FileText, MessageSquare, BarChart3, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "รองรับหลายรูปแบบไฟล์",
    description: "อัปโหลดไฟล์ PDF, DOCX และ TXT พร้อมการสกัดและประมวลผลเนื้อหาโดยอัตโนมัติ",
  },
  {
    icon: MessageSquare,
    title: "การเรียนรู้แบบโต้ตอบ",
    description: "แสดงความเข้าใจของคุณด้วยคำพูดของคุณเองและรับข้อเสนอแนะจาก AI ที่ละเอียด",
  },
  {
    icon: BarChart3,
    title: "ติดตามความก้าวหน้า",
    description: "เห็นภาพการเดินทางการเรียนรู้ของคุณด้วยการวิเคราะห์และข้อมูลเชิงลึกที่ครอบคลุม",
  },
  {
    icon: Shield,
    title: "ปลอดภัยและเป็นส่วนตัว",
    description: "ข้อมูลของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัยด้วยการป้องกันระดับองค์กร",
  },
  {
    icon: Zap,
    title: "ข้อเสนอแนะทันที",
    description: "รับการวิเคราะห์และคำแนะนำที่ขับเคลื่อนด้วย AI ทันทีเพื่อปรับปรุงความเข้าใจของคุณ",
  },
  {
    icon: CheckCircle,
    title: "การเรียนรู้ที่ปรับแต่งเฉพาะบุคคล",
    description: "เส้นทางการเรียนรู้ที่ปรับตัวได้ตามสไตล์การเรียนรู้และจังหวะที่เป็นเอกลักษณ์ของคุณ",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            คุณสมบัติที่ทรงพลัง
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ทุกสิ่งที่คุณต้องการเพื่อเพิ่มประสบการณ์การเรียนรู้ของคุณด้วยเทคโนโลยี AI ที่ล้ำสมัย
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
