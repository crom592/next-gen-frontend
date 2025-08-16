'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createSupabaseClient, type Profile } from '@/lib/supabase'

export interface AuthUser extends User {
  profile?: Profile
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userWithProfile = await fetchUserProfile(session.user)
        setUser(userWithProfile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userWithProfile = await fetchUserProfile(session.user)
          setUser(userWithProfile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (user: User): Promise<AuthUser> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return { ...user, profile: profile || undefined }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return user
    }
  }

  const signUp = async (email: string, password: string, username: string, role: 'creator' | 'buyer' = 'buyer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role
          }
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      router.push('/')
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      // Update local user state
      setUser(prev => prev ? { ...prev, profile: data } : null)

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  return {
    user,
    profile: user?.profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshSession,
    isAuthenticated: !!user,
    isCreator: user?.profile?.role === 'creator',
    isBuyer: user?.profile?.role === 'buyer'
  }
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAuth?: boolean; requireRole?: 'creator' | 'buyer' } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (loading) return

      if (options.requireAuth && !user) {
        router.push('/auth/signin')
        return
      }

      if (options.requireRole && user?.profile?.role !== options.requireRole) {
        router.push('/unauthorized')
        return
      }
    }, [user, loading, router])

    if (loading) {
      return React.createElement('div', {
        className: 'flex items-center justify-center min-h-screen'
      }, React.createElement('div', {
        className: 'animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'
      }))
    }

    if (options.requireAuth && !user) {
      return null
    }

    if (options.requireRole && user?.profile?.role !== options.requireRole) {
      return null
    }

    return React.createElement(Component, props)
  }
}