/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ewtqsgziwkpbuqvctnex.supabase.co',
      'supabase.co'
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig