import { createClient } from './supabase-server'
import { redirect } from 'next/navigation'
import type { Profile, UserRole } from '@/types'

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as Profile | null
}

export async function requireAuth(requiredRole?: UserRole) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  if (requiredRole) {
    const hierarchy: UserRole[] = ['viewer', 'editor', 'admin']
    if (
      hierarchy.indexOf(profile.role) < hierarchy.indexOf(requiredRole)
    ) {
      redirect('/dashboard?error=unauthorized')
    }
  }

  return profile
}
