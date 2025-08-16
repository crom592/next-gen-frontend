'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient, type Video } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface VideoFilters {
  search?: string
  status?: 'processing' | 'active' | 'inactive'
  creatorId?: string
  page?: number
  limit?: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export function useVideos(filters: VideoFilters = {}) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const supabase = createSupabaseClient()
  const { user } = useAuth()

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:creator_id (
            username
          )
        `, { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      } else {
        // Default to active videos for public viewing
        query = query.eq('status', 'active')
      }

      if (filters.creatorId) {
        query = query.eq('creator_id', filters.creatorId)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      setVideos(data || [])
      setPagination({
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      })

    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching videos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [filters.search, filters.status, filters.creatorId, filters.page, filters.limit])

  const refetch = () => fetchVideos()

  return {
    videos,
    loading,
    error,
    pagination,
    refetch
  }
}

export function useVideo(videoId: string | null) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPurchased, setIsPurchased] = useState(false)

  const supabase = createSupabaseClient()
  const { user } = useAuth()

  const fetchVideo = async () => {
    if (!videoId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch video details
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:creator_id (
            username
          )
        `)
        .eq('id', videoId)
        .single()

      if (videoError) throw videoError

      setVideo(videoData)

      // Check if user has purchased this video
      if (user && videoData.creator_id !== user.id) {
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('buyer_id', user.id)
          .eq('video_id', videoId)
          .eq('payment_status', 'completed')
          .single()

        setIsPurchased(!!purchase)
      } else {
        setIsPurchased(false) // Creator doesn't need to purchase their own video
      }

    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching video:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideo()
  }, [videoId, user?.id])

  const refetch = () => fetchVideo()

  return {
    video,
    loading,
    error,
    isPurchased,
    refetch
  }
}

export function useVideoUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()
  const { user } = useAuth()

  const uploadVideo = async (
    file: File,
    title: string,
    description: string,
    price: number,
    thumbnail?: File
  ) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setUploading(true)
      setError(null)
      setProgress(0)

      // Create form data
      const formData = new FormData()
      formData.append('video', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price.toString())
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      // Get user session for authorization
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // Call upload edge function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/upload-video`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setProgress(100)
      return result.video

    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadVideo,
    uploading,
    progress,
    error
  }
}

export function useVideoStream() {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()

  const generateStreamUrl = async (videoId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Get user session for authorization
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // Call stream generation edge function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-stream`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ videoId })
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate stream URL')
      }

      setStreamUrl(result.streamUrl)
      return result

    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearStreamUrl = () => {
    setStreamUrl(null)
    setError(null)
  }

  return {
    generateStreamUrl,
    streamUrl,
    loading,
    error,
    clearStreamUrl
  }
}