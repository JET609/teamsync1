'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile, UserRole } from '@/types'
import { createClient } from '@/lib/supabase-browser'

export default function AdminDashboard({
  initialProfiles,
}: {
  initialProfiles: Profile[]
}) {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  async function updateRole(id: string, role: UserRole) {
    setSaving(id)
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
    if (!error)
      setProfiles((p) =>
        p.map((u) => (u.id === id ? { ...u, role } : u))
      )
    setSaving(null)
    setMsg(error ? 'Failed' : 'Role updated')
    setTimeout(() => setMsg(null), 2500)
  }

  const roleColors: Record<string, string> = {
    admin: 'text-[#ff6a6a]',
    editor: 'text-[#7c6aff]',
    viewer: 'text-[#6affb8]',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-[#6b6b85] hover:text-white text-xs transition-colors"
            >
              ← Directory
            </Link>
            <span className="font-bold text-sm">Admin Dashboard</span>
          </div>
          {msg && (
            <span className="text-xs text-[#6affb8] bg-[#6affb8]/10 border border-[#6affb8]/30 px-3 py-1 rounded-full">
              {msg}
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-xs text-[#ff6a6a] uppercase tracking-wider mb-2">
            Admin Panel
          </div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-[#6b6b85] text-sm">
            {profiles.length} total users
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(['admin', 'editor', 'viewer'] as UserRole[]).map((r) => (
            <div
              key={r}
              className="bg-[#111118] border border-[#2a2a3a] rounded-xl p-5"
            >
              <p className="text-xs text-[#6b6b85] uppercase tracking-wider mb-1">
                {r}s
              </p>
              <p className={`text-2xl font-bold ${roleColors[r]}`}>
                {profiles.filter((p) => p.role === r).length}
              </p>
            </div>
          ))}
          <div className="bg-[#111118] border border-[#2a2a3a] rounded-xl p-5">
            <p className="text-xs text-[#6b6b85] uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-white">
              {profiles.length}
            </p>
          </div>
        </div>

        {/* User table */}
        <div className="bg-[#111118] border border-[#2a2a3a] rounded-2xl overflow-hidden">
          <div className="border-b border-[#2a2a3a] px-6 py-4 bg-[#18181f] grid grid-cols-12 gap-4 text-xs text-[#6b6b85] uppercase tracking-wider">
            <span className="col-span-5">User</span>
            <span className="col-span-3">Role</span>
            <span className="col-span-4">Joined</span>
          </div>
          {profiles.map((p) => (
            <div
              key={p.id}
              className="px-6 py-4 border-b border-[#2a2a3a] last:border-none grid grid-cols-12 gap-4 items-center hover:bg-[#18181f]/50 transition-colors"
            >
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6aff]/40 to-[#6affb8]/40 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(p.email || p.full_name || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">
                    {p.full_name || '—'}
                  </p>
                  <p className="text-xs text-[#6b6b85] truncate">
                    {p.email || p.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <select
                  value={p.role}
                  disabled={saving === p.id}
                  onChange={(e) =>
                    updateRole(p.id, e.target.value as UserRole)
                  }
                  className="bg-[#18181f] border border-[#2a2a3a] text-white text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-span-4 text-xs text-[#6b6b85]">
                {new Date(p.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
