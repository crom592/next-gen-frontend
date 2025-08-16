'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient, type Video } from '@/lib/supabase'
import { Play, Star, Clock, User, ArrowRight } from 'lucide-react'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select(`
            *,
            profiles:creator_id (
              username
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) throw error
        setVideos(data || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">NEXT GEN</h1>
            </div>
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

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            차세대 비디오
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              플랫폼
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            콘텐츠 제작자와 구매자를 연결하는 혁신적인 비디오 플랫폼. 
            워터마킹 기술로 안전하게 콘텐츠를 보호합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup?role=creator" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center justify-center"
            >
              제작자로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/videos" 
              className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center"
            >
              비디오 둘러보기
              <Play className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">인기 비디오</h2>
            <Link 
              href="/videos" 
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center"
            >
              전체보기
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 aspect-video rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <div className="group cursor-pointer">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">왜 NextGen인가요?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              최신 기술과 혁신적인 기능으로 안전하고 편리한 비디오 플랫폼을 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">워터마킹 기술</h3>
              <p className="text-gray-400">
                사용자별 워터마크로 무단 배포를 방지하고 콘텐츠를 안전하게 보호합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">실시간 스트리밍</h3>
              <p className="text-gray-400">
                빠르고 안정적인 스트리밍으로 끊김 없는 시청 경험을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">쉬운 수익화</h3>
              <p className="text-gray-400">
                간단한 업로드와 가격 설정으로 콘텐츠를 수익화할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 NextGen. All rights reserved. 
            <span className="block mt-2 text-sm">
              🤖 Powered by Supabase + Next.js
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}