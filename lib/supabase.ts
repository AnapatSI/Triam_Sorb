import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for use in client components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

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
  category?: string
  time_spent?: string
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

  async getLearningHistory(
    userId: string, 
    page: number, 
    pageSize: number,
    options?: {
      searchTerm?: string
      category?: string
      sortBy?: 'date' | 'score' | 'title'
    }
  ) {
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    let query = supabase
      .from("learning_sessions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)

    // Apply search filter
    if (options?.searchTerm) {
      query = query.ilike("lesson_title", `%${options.searchTerm}%`)
    }

    // Apply category filter
    if (options?.category && options.category !== "all") {
      query = query.eq("category", options.category)
    }

    // Apply sorting
    if (options?.sortBy === "score") {
      query = query.order("comprehension_score", { ascending: false })
    } else if (options?.sortBy === "title") {
      query = query.order("lesson_title", { ascending: true })
    } else {
      // Default sort by date (newest first)
      query = query.order("created_at", { ascending: false })
    }

    const { data, error, count } = await query.range(start, end)
    return { data, error, count }
  },

  async getLearningSession(id: string) {
    const { data, error } = await supabase.from("learning_sessions").select("*").eq("id", id).single()
    return { data, error }
  },

  async updateLearningSession(id: string, updates: Partial<LearningSession>) {
    const { data, error } = await supabase.from("learning_sessions").update(updates).eq("id", id).select().single()
    return { data, error }
  },

  // Get unique categories for filter dropdown
  async getCategories(userId: string) {
    const { data, error } = await supabase
      .from("learning_sessions")
      .select("category")
      .eq("user_id", userId)
      .not("category", "is", null)
    
    if (error) return { data: [], error }
    
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean)
    return { data: categories, error: null }
  },
}
