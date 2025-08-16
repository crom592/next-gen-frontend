'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient, type Video } from '@/lib/supabase'
import { Play, Star, Clock, User, Filter, Search, BookOpen, Award, TrendingUp } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const supabase = createSupabaseClient()

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'content-creation', name: '콘텐츠 제작' },
    { id: 'video-editing', name: '영상편집' },
    { id: 'social-media', name: '소셜미디어 마케팅' },
    { id: 'personal-branding', name: '개인 브랜딩' },
    { id: 'live-streaming', name: '라이브 스트리밍' },
    { id: 'monetization', name: '수익화 전략' }
  ]

  useEffect(() => {
    const fetchCourses = async () => {
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

        if (error) throw error
        setCourses(data || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all'
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-neon-green">NEXT GEN</h1>
                <span className="ml-2 text-sm font-medium text-gray-400">Creator Academy</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link 
                href="/courses" 
                className="text-neon-green px-3 py-2 rounded-md text-sm font-medium"
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
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              차세대 크리에이터 
              <span className="block text-neon-green drop-shadow-lg animate-glow">
                육성 아카데미
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              콘텐츠 제작부터 수익화까지, 성공하는 크리에이터가 되기 위한 모든 것을 배워보세요.
              실무 전문가들이 직접 전수하는 차세대 크리에이터 교육 프로그램입니다.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="강의 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <BookOpen className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green mb-1">50+</div>
              <div className="text-gray-400 text-sm">전문 강의</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Award className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green mb-1">15+</div>
              <div className="text-gray-400 text-sm">전문 강사</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green mb-1">5,000+</div>
              <div className="text-gray-400 text-sm">수강생</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Star className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green mb-1">4.9</div>
              <div className="text-gray-400 text-sm">평균 평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              전체 강의 ({filteredCourses.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 aspect-video rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 카테고리를 시도해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="group cursor-pointer bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700 hover:border-neon-green/50 transition-all duration-300 hover:shadow-neon">
                    <div className="relative aspect-video bg-gray-800 overflow-hidden">
                      {course.thumbnail_path ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${course.thumbnail_path}`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(course.duration)}
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-neon-green/20 backdrop-blur-sm rounded-full p-3">
                          <Play className="w-8 h-8 text-neon-green" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-white group-hover:text-neon-green transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {course.profiles?.username || 'NextGen Academy'}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-neon-green">
                          {formatPrice(course.price)}
                        </span>
                        <div className="flex items-center text-sm text-gray-400">
                          <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                          4.9
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
    </div>
  )
}