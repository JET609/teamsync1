'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function SignupPage() {
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#6affb8]/10 border border-[#6affb8]/30 flex items-center justify-center mx-auto mb-6 text-2xl text-[#6affb8]">
            ✓
          </div>
          <h2 className="font-bold text-2xl text-white mb-3">
            Check your email
          </h2>
          <p className="text-[#6b6b85] text-sm mb-6">
            Confirmation link sent to{' '}
            <strong className="text-white">{email}</strong>
          </p>
          <Link
            href="/login"
            className="text-[#7c6aff] hover:text-[#6affb8] text-sm transition-colors"
          >
            Back to login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create account
          </h1>
          <p className="text-[#6b6b85] text-sm">Join your team workspace</p>
        </div>

        <div className="bg-[#111118] border border-[#2a2a3a] rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full bg-[#18181f] border border-[#2a2a3a] focus:border-[#7c6aff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-[#44445a]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full bg-[#18181f] border border-[#2a2a3a] focus:border-[#7c6aff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-[#44445a]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#18181f] border border-[#2a2a3a] focus:border-[#7c6aff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-[#44445a]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#18181f] border border-[#2a2a3a] focus:border-[#7c6aff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-[#44445a]"
              />
            </div>

            <div className="bg-[#7c6aff]/5 border border-[#7c6aff]/20 rounded-lg px-4 py-3 text-xs text-[#6b6b85]">
              New accounts start with{' '}
              <span className="text-[#7c6aff]">Viewer</span> role.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c6aff] hover:bg-[#6a58e8] disabled:opacity-60 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-[#6b6b85] text-sm mt-6">
            Have an account?{' '}
            <Link
              href="/login"
              className="text-[#7c6aff] hover:text-[#6affb8] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
