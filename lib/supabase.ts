import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          role: 'creator' | 'buyer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          role?: 'creator' | 'buyer'
        }
        Update: {
          username?: string
          role?: 'creator' | 'buyer'
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          file_path: string
          thumbnail_path: string | null
          price: number
          status: 'processing' | 'active' | 'inactive'
          duration: number | null
          file_size: number | null
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string
          price: number
          file_path: string
          creator_id: string
          thumbnail_path?: string
        }
        Update: {
          title?: string
          description?: string
          price?: number
          status?: 'processing' | 'active' | 'inactive'
        }
      }
      purchases: {
        Row: {
          id: string
          buyer_id: string
          video_id: string
          amount: number
          payment_status: 'pending' | 'completed' | 'failed'
          payment_method: string | null
          payment_data: any
          purchased_at: string
        }
        Insert: {
          buyer_id: string
          video_id: string
          amount: number
          payment_method?: string
        }
        Update: {
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_data?: any
        }
      }
      streaming_sessions: {
        Row: {
          id: string
          user_id: string
          video_id: string
          session_token: string
          expires_at: string
          ip_address: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          video_id: string
          session_token: string
          expires_at: string
          ip_address?: string
        }
        Update: {
          expires_at?: string
        }
      }
    }
    Views: {
      video_analytics: {
        Row: {
          id: string
          title: string
          creator_id: string
          price: number
          created_at: string
          total_purchases: number
          total_revenue: number
          unique_viewers: number
        }
      }
    }
  }
}

// Utility types
export type Video = Database['public']['Tables']['videos']['Row'] & {
  profiles?: {
    username: string
  }
  _count?: {
    purchases: number
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row'] & {
  video?: Video
}
export type StreamingSession = Database['public']['Tables']['streaming_sessions']['Row']

// Helper functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

export const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}