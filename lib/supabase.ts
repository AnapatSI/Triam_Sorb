import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface LearningSession {
  id: string
  user_id: string
  lesson_title: string
  lesson_content: string
  user_understanding: string
  ai_feedback: string
  comprehension_score: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

// API functions for interacting with Supabase
export const supabaseApi = {
  // Auth functions
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  // Learning session functions
  async createLearningSession(session: Omit<LearningSession, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("learning_sessions").insert([session]).select().single()
    return { data, error }
  },

  async getLearningHistory(userId: string) {
    const { data, error } = await supabase
      .from("learning_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  async getLearningSession(id: string) {
    const { data, error } = await supabase.from("learning_sessions").select("*").eq("id", id).single()
    return { data, error }
  },

  async updateLearningSession(id: string, updates: Partial<LearningSession>) {
    const { data, error } = await supabase.from("learning_sessions").update(updates).eq("id", id).select().single()
    return { data, error }
  },
}
