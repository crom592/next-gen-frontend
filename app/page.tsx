'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient, type Video } from '@/lib/supabase'
import { Play, Star, Clock, User, ArrowRight, BookOpen, Award, Users, TrendingUp } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-neon-green">NEXT GEN</h1>
              <span className="ml-2 text-sm font-medium text-gray-400">Creator Academy</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/courses" 
                className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                강의
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                소개
              </Link>
              <Link 
                href="/auth/signin" 
                className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-neon-green text-black px-4 py-2 rounded-md text-sm font-bold hover:shadow-neon transition-all duration-300"
              >
                무료 가입
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            차세대 크리에이터의
            <span className="block text-neon-green drop-shadow-lg animate-glow">
              꿈을 현실로
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            콘텐츠 제작부터 수익화까지, 성공하는 크리에이터가 되기 위한 모든 것을 배워보세요. 
            현역 크리에이터들이 직접 전수하는 실무 중심의 교육 프로그램입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses" 
              className="bg-neon-green text-black px-8 py-4 rounded-lg font-bold hover:shadow-neon-lg transition-all duration-300 flex items-center justify-center text-lg"
            >
              강의 둘러보기
              <BookOpen className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/auth/signup" 
              className="border-2 border-neon-green text-neon-green px-8 py-4 rounded-lg font-bold hover:bg-neon-green hover:text-black transition-all duration-300 flex items-center justify-center text-lg"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">50+</div>
              <div className="text-gray-400 text-sm">전문 강의</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">5k+</div>
              <div className="text-gray-400 text-sm">수강생</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">15+</div>
              <div className="text-gray-400 text-sm">전문 강사</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">4.9</div>
              <div className="text-gray-400 text-sm">평균 평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">인기 강의</h2>
            <Link 
              href="/courses" 
              className="text-neon-green hover:text-green-400 font-medium flex items-center"
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
                <Link key={video.id} href={`/courses/${video.id}`}>
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
                      <h3 className="font-medium text-white group-hover:text-neon-green transition-colors duration-200 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {video.profiles?.username || 'Unknown'}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-neon-green">
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
            <h2 className="text-3xl font-bold text-white mb-4">왜 NEXT GEN Creator Academy인가요?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              차세대 크리에이터 육성을 위한 최고의 교육과 지원 시스템을 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-neon-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">전문 강사진</h3>
              <p className="text-gray-400">
                현업에서 인정받는 전문가들이 직접 제작한 고품질 강의를 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-neon-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">실무 중심 커리큘럼</h3>
              <p className="text-gray-400">
                이론뿐 아니라 실제 업무에 바로 적용할 수 있는 실무 중심의 내용을 학습합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-neon-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">커뮤니티 지원</h3>
              <p className="text-gray-400">
                동료 학습자들과 함께 네트워크를 형성하고 서로 도움을 받으며 성장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 NEXT GEN Creator Academy. All rights reserved. 
            <span className="block mt-2 text-sm">
              🤖 Powered by Supabase + Next.js
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}