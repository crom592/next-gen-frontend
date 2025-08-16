'use client'

import Link from 'next/link'
import { Award, Users, TrendingUp, BookOpen, Play, Star, ArrowRight, CheckCircle, Target, Lightbulb, Heart } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: BookOpen, value: '50+', label: '전문 강의', color: 'text-neon-green' },
    { icon: Users, value: '5,000+', label: '수강생', color: 'text-blue-400' },
    { icon: Award, value: '15+', label: '전문 강사', color: 'text-purple-400' },
    { icon: Star, value: '4.9', label: '평균 평점', color: 'text-yellow-400' }
  ]

  const features = [
    {
      icon: Target,
      title: '실무 중심 교육',
      description: '현업에서 바로 활용할 수 있는 실전 노하우와 기술을 전수합니다.'
    },
    {
      icon: Users,
      title: '1:1 멘토링',
      description: '전문 강사진과의 개별 멘토링으로 개인 맞춤형 성장을 지원합니다.'
    },
    {
      icon: TrendingUp,
      title: '수익화 전략',
      description: '콘텐츠 제작뿐만 아니라 실제 수익 창출 방법까지 알려드립니다.'
    },
    {
      icon: Lightbulb,
      title: '창의적 사고',
      description: '차별화된 콘텐츠 아이디어 발굴과 창의적 표현 방법을 배웁니다.'
    },
    {
      icon: Heart,
      title: '커뮤니티',
      description: '같은 꿈을 가진 동료들과 함께 성장하고 네트워킹할 수 있습니다.'
    },
    {
      icon: CheckCircle,
      title: '평생 지원',
      description: '수강 후에도 지속적인 업데이트와 커뮤니티 지원을 제공합니다.'
    }
  ]

  const instructors = [
    {
      name: '김영훈',
      title: '콘텐츠 크리에이터',
      expertise: '유튜브 · 틱톡 · 인스타그램',
      followers: '100만+',
      description: '5년간 다양한 플랫폼에서 활동하며 누적 구독자 100만을 달성한 멀티 크리에이터'
    },
    {
      name: '박지은',
      title: '브랜딩 전문가',
      expertise: '개인 브랜딩 · 마케팅',
      followers: '50만+',
      description: '브랜드 컨설팅 10년 경력, 개인 브랜딩으로 연간 10억원 매출 달성'
    },
    {
      name: '이민수',
      title: '영상 편집 전문가',
      expertise: '영상 편집 · 모션 그래픽',
      followers: '80만+',
      description: '유명 기업 광고 영상 제작 경력, 창의적 편집 기법으로 유명한 영상 크리에이터'
    }
  ]

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
                className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                강의
              </Link>
              <Link 
                href="/about" 
                className="text-neon-green px-3 py-2 rounded-md text-sm font-medium"
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            차세대 크리에이터를
            <span className="block text-neon-green drop-shadow-lg animate-glow">
              함께 만들어가는 곳
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            NEXT GEN Creator Academy는 단순히 기술을 가르치는 곳이 아닙니다. 
            여러분의 창의성을 발견하고, 독창적인 콘텐츠로 세상과 소통하며, 
            지속 가능한 수익을 만들어가는 진정한 크리에이터로 성장시키는 교육 플랫폼입니다.
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <IconComponent className={`w-10 h-10 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">우리의 미션</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              디지털 시대의 주역이 될 차세대 크리에이터들이 자신만의 색깔로 
              세상과 소통하며 지속 가능한 성공을 이룰 수 있도록 돕습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">왜 NEXT GEN인가요?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-neon-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">실무 중심 교육</h4>
                    <p className="text-gray-400">이론이 아닌 실제 현업에서 통하는 실무 기술과 노하우를 전수합니다.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-neon-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">검증된 강사진</h4>
                    <p className="text-gray-400">각 분야에서 실제 성과를 입증한 현역 크리에이터들이 직접 강의합니다.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-neon-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">지속적인 지원</h4>
                    <p className="text-gray-400">강의 수강 후에도 커뮤니티와 멘토링을 통해 지속적으로 성장을 지원합니다.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-neon-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">트렌드 반영</h4>
                    <p className="text-gray-400">빠르게 변화하는 디지털 트렌드를 실시간으로 반영한 최신 커리큘럼을 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-neon-green/10 to-transparent p-8 rounded-2xl border border-neon-green/20">
              <h3 className="text-2xl font-bold text-white mb-6">우리가 추구하는 가치</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>
                  <span className="text-gray-300"><strong className="text-white">창의성</strong> - 남들과 다른 독창적인 콘텐츠</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>
                  <span className="text-gray-300"><strong className="text-white">진정성</strong> - 자신만의 스토리와 메시지</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>
                  <span className="text-gray-300"><strong className="text-white">지속성</strong> - 장기적인 성장과 수익 창출</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neon-green rounded-full mr-3"></div>
                  <span className="text-gray-300"><strong className="text-white">연결성</strong> - 오디언스와의 깊은 소통</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">특별한 교육 방식</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              단순한 지식 전달이 아닌, 실제 성과로 이어지는 체계적인 교육 시스템
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 hover:border-neon-green/50 transition-all duration-300">
                  <div className="bg-neon-green/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">전문 강사진</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              각 분야에서 검증된 실력과 성과를 가진 현역 크리에이터들이 직접 가르칩니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={index} className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold text-xl">{instructor.name[0]}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{instructor.name}</h3>
                <p className="text-neon-green font-medium mb-1">{instructor.title}</p>
                <p className="text-gray-400 text-sm mb-2">{instructor.expertise}</p>
                <div className="bg-neon-green/10 text-neon-green px-3 py-1 rounded-full text-sm inline-block mb-3">
                  팔로워 {instructor.followers}
                </div>
                <p className="text-gray-400 text-sm">{instructor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-neon-green/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            차세대 크리에이터로의 여정을 NEXT GEN과 함께 시작해보세요. 
            무료 강의부터 시작하여 여러분만의 성공 스토리를 만들어가세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses" 
              className="bg-neon-green text-black px-8 py-4 rounded-lg font-bold hover:shadow-neon-lg transition-all duration-300 flex items-center justify-center text-lg"
            >
              무료 강의 보기
              <Play className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/auth/signup" 
              className="border-2 border-neon-green text-neon-green px-8 py-4 rounded-lg font-bold hover:bg-neon-green hover:text-black transition-all duration-300 flex items-center justify-center text-lg"
            >
              지금 가입하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
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