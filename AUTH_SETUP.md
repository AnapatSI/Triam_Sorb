# 🚀 คู่มือการตั้งค่าระบบ Authentication

## 📋 สิ่งที่ต้องทำ

### 1. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root ของโปรเจค:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. ตั้งค่า Supabase Database

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor**
4. รัน SQL script จากไฟล์ `database-schema.sql`

### 3. ตั้งค่า Supabase Auth

1. ไปที่ **Authentication > Settings**
2. เปิดใช้งาน **Email confirmations** (ถ้าต้องการ)
3. ตั้งค่า **Site URL** เป็น `http://localhost:3000` (สำหรับ development)
4. ตั้งค่า **Redirect URLs** เป็น:
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`
   - `http://localhost:3000/dashboard`

### 4. ตั้งค่า Row Level Security (RLS)

RLS ถูกเปิดใช้งานแล้วใน SQL script แต่คุณสามารถตรวจสอบได้ที่:
- **Database > Tables > users > Policies**
- **Database > Tables > learning_sessions > Policies**

## 🏗️ โครงสร้างระบบ

```
├── components/
│   ├── AuthProvider.tsx          # จัดการ user state
│   └── layout/
│       └── Navbar.tsx            # แสดงสถานะ login/logout
├── app/
│   ├── login/page.tsx            # หน้าเข้าสู่ระบบ
│   ├── signup/page.tsx           # หน้าสมัครสมาชิก
│   ├── dashboard/page.tsx        # หน้าแดชบอร์ด (ต้อง login)
│   └── layout.tsx                # ใช้ AuthProvider
├── lib/
│   └── supabase.ts               # Supabase client
├── middleware.ts                 # ป้องกัน route
└── database-schema.sql           # โครงสร้างฐานข้อมูล
```

## 🔐 ฟีเจอร์ที่รองรับ

### ✅ Authentication
- [x] สมัครสมาชิกด้วย Email/Password
- [x] เข้าสู่ระบบด้วย Email/Password
- [x] ออกจากระบบ
- [x] Session management
- [x] JWT token auto-refresh

### ✅ Route Protection
- [x] ป้องกัน route `/learn`, `/upload`, `/history`, `/dashboard`
- [x] Redirect ไป login ถ้าไม่ได้ authenticate
- [x] Redirect ไป dashboard ถ้า login แล้ว

### ✅ User Management
- [x] แสดงข้อมูลผู้ใช้ใน Navbar
- [x] หน้า Dashboard แสดงข้อมูลผู้ใช้
- [x] ปุ่มออกจากระบบ

### ✅ Database Integration
- [x] ตาราง `users` เชื่อมกับ Supabase Auth
- [x] ตาราง `learning_sessions` เชื่อมกับผู้ใช้
- [x] Row Level Security (RLS)
- [x] Auto-create user profile เมื่อ signup

## 🚀 การใช้งาน

### การ Login
1. ไปที่ `/login`
2. กรอก Email และ Password
3. กดปุ่ม "เข้าสู่ระบบ"
4. ระบบจะ redirect ไปหน้าแรก

### การสมัครสมาชิก
1. ไปที่ `/signup`
2. กรอก Email และ Password
3. กดปุ่ม "สมัครสมาชิก"
4. ตรวจสอบอีเมล (ถ้าเปิด Email confirmation)
5. ระบบจะ redirect ไปหน้าแรก

### การออกจากระบบ
1. คลิกปุ่ม "ออกจากระบบ" ใน Navbar หรือ Dashboard
2. ระบบจะ redirect ไปหน้าแรก

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **"Invalid API key"**
   - ตรวจสอบ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ใน `.env.local`

2. **"Invalid URL"**
   - ตรวจสอบ `NEXT_PUBLIC_SUPABASE_URL` ใน `.env.local`

3. **"User not found"**
   - ตรวจสอบว่า SQL script ถูกรันแล้ว
   - ตรวจสอบ trigger `on_auth_user_created`

4. **"Access denied"**
   - ตรวจสอบ RLS policies
   - ตรวจสอบว่า user login แล้ว

### การ Debug

1. เปิด Browser Developer Tools
2. ดู Console สำหรับ error messages
3. ตรวจสอบ Network tab สำหรับ API calls
4. ใช้ Supabase Dashboard > Logs สำหรับ server-side errors

## 📚 เพิ่มเติม

### การเพิ่มฟีเจอร์

1. **Email Verification**
   - เปิดใน Supabase Auth > Settings
   - ตั้งค่า email template

2. **Social Login**
   - เพิ่ม provider ใน Supabase Auth > Providers
   - อัปเดต login form

3. **Password Reset**
   - เปิดใน Supabase Auth > Settings
   - สร้างหน้า reset password

4. **User Profile**
   - อัปเดตตาราง `users`
   - สร้างหน้าแก้ไขโปรไฟล์

### การ Deploy

1. ตั้งค่า Environment Variables ใน production
2. อัปเดต Site URL และ Redirect URLs
3. ตรวจสอบ CORS settings
4. ทดสอบ authentication flow

## 🎯 สรุป

ระบบ Authentication นี้ใช้ Supabase เป็น backend และ Next.js App Router เป็น frontend มีฟีเจอร์ครบถ้วนสำหรับการจัดการผู้ใช้และการป้องกัน route ที่ต้อง login เท่านั้น 