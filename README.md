# NextGen 비디오 플랫폼 - Frontend

차세대 비디오 플랫폼의 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage + Edge Functions)
- **State Management**: Zustand
- **Video Player**: Custom React Video Player
- **Forms**: React Hook Form + Zod

## 🎯 주요 기능

- ✅ 사용자 인증 (로그인/회원가입)
- ✅ 비디오 업로드 및 관리
- ✅ 워터마킹 비디오 플레이어
- ✅ 결제 시스템 연동
- ✅ 실시간 스트리밍
- ✅ 반응형 디자인

## 🛠 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── video/          # 비디오 관련 컴포넌트
│   ├── payment/        # 결제 관련 컴포넌트
│   └── common/         # 공통 컴포넌트
├── hooks/              # 커스텀 훅
│   ├── useAuth.ts      # 인증 훅
│   ├── useVideos.ts    # 비디오 관리 훅
│   └── usePurchases.ts # 구매 관련 훅
├── lib/                # 유틸리티 라이브러리
│   ├── supabase.ts     # Supabase 클라이언트
│   └── utils.ts        # 헬퍼 함수
├── pages/              # Next.js 페이지
│   ├── auth/           # 인증 페이지
│   ├── videos/         # 비디오 관련 페이지
│   └── dashboard/      # 대시보드
└── styles/             # 스타일 파일
```

## 🎨 주요 컴포넌트

### VideoPlayer
워터마킹을 지원하는 커스텀 비디오 플레이어

```tsx
<VideoPlayer 
  src={streamUrl}
  title="비디오 제목"
  watermarkText="사용자ID"
/>
```

### AuthForm
로그인/회원가입 폼

```tsx
<AuthForm 
  mode="signin" // or "signup"
  onSuccess={() => router.push('/dashboard')}
/>
```

### VideoUpload
비디오 업로드 컴포넌트

```tsx
<VideoUpload 
  onUploadComplete={(video) => console.log('업로드 완료:', video)}
/>
```

## 🔐 인증 플로우

1. **회원가입**: 이메일 + 패스워드 + 사용자명 + 역할(creator/buyer)
2. **로그인**: 이메일 + 패스워드
3. **프로필**: Supabase Auth + public.profiles 테이블
4. **권한**: Role-based access control

## 📹 비디오 처리 플로우

1. **업로드**: 파일 → Supabase Storage
2. **처리**: Edge Function으로 워터마킹
3. **스트리밍**: JWT 토큰 기반 보안 URL
4. **재생**: 사용자별 워터마크 적용

## 💳 결제 플로우

1. **상품 선택**: 비디오 상세 페이지
2. **결제 요청**: purchases 테이블에 pending 상태 생성
3. **결제 처리**: 외부 결제 게이트웨이 연동
4. **완료**: completed 상태로 업데이트 → 스트리밍 접근 권한

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 환경별 설정

- **Development**: `http://localhost:3000`
- **Staging**: `https://next-gen-frontend-staging.vercel.app`
- **Production**: `https://next-gen-frontend.vercel.app`

## 📊 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트
- **코드 분할**: 동적 import 사용
- **캐싱**: Supabase 쿼리 결과 캐싱
- **SEO**: 메타 태그 및 구조화된 데이터

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 타입 검사
npm run type-check
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 지원

문제가 있거나 기능 요청이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**NextGen** - 차세대 비디오 플랫폼으로 콘텐츠 제작자와 구매자를 연결합니다. 🎬