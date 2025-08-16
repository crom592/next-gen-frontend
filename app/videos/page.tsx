'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List, Play, Star, User, Clock } from 'lucide-react'
import { createSupabaseClient, type Video } from '@/lib/supabase'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('latest')
  
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchVideos()
  }, [searchQuery, sortBy])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:creator_id (
            username
          )
        `)
        .eq('status', 'active')

      // Search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Sort
      switch (sortBy) {
        case 'latest':
          query = query.order('created_at', { ascending: false })
          break
        case 'price_low':
          query = query.order('price', { ascending: true })
          break
        case 'price_high':
          query = query.order('price', { ascending: false })
          break
        case 'popular':
          // In a real app, you'd sort by view count or purchase count
          query = query.order('created_at', { ascending: false })
          break
      }

      const { data, error } = await query

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              NEXT GEN
            </Link>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/auth/signin" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                로그인
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                회원가입
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">모든 비디오</h1>
          <p className="text-gray-400">다양한 콘텐츠를 둘러보고 원하는 비디오를 찾아보세요</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="비디오 검색..."
              className="form-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input min-w-[150px]"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="price_low">가격 낮은순</option>
              <option value="price_high">가격 높은순</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {loading ? '검색 중...' : `${videos.length}개의 비디오를 찾았습니다`}
          </p>
        </div>

        {/* Videos Grid/List */}
        {loading ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                {viewMode === 'grid' ? (
                  <>
                    <div className="bg-gray-800 aspect-video rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-4 bg-gray-800/50 rounded-lg p-4">
                    <div className="w-48 h-28 bg-gray-800 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {videos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`}>
                {viewMode === 'grid' ? (
                  <div className="group cursor-pointer card-hover">
                    <div className="relative bg-gray-800 aspect-video rounded-lg mb-4 overflow-hidden">
                      {video.thumbnail_path ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${video.thumbnail_path}`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {video.profiles?.username || 'Unknown'}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-400">
                          {formatPrice(video.price)}
                        </span>
                        <div className="flex items-center text-sm text-gray-400">
                          <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                          4.8
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="group cursor-pointer bg-gray-800/20 rounded-lg p-4 hover:bg-gray-800/40 transition-colors duration-200">
                    <div className="flex gap-4">
                      <div className="relative w-48 h-28 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {video.thumbnail_path ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${video.thumbnail_path}`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-200 line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <User className="w-4 h-4 mr-1" />
                          {video.profiles?.username || 'Unknown'}
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          {formatDuration(video.duration)}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {video.description || '설명이 없습니다.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-purple-400">
                            {formatPrice(video.price)}
                          </span>
                          <div className="flex items-center text-sm text-gray-400">
                            <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                            4.8 (142)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-400 mb-4">다른 키워드로 검색해보세요</p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary"
            >
              전체 비디오 보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}