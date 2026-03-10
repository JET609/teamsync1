export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/types'
import type { Employee } from '@/types'
import Link from 'next/link'

export default async function DashboardPage() {
  const profile = await requireAuth()
  const supabase = createClient()
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  const canAdd = hasPermission(profile.role, 'canAddEmployee')
  const canDelete = hasPermission(profile.role, 'canDeleteEmployee')

  const roleColors: Record<string, string> = {
    admin: 'text-[#ff6a6a] bg-[#ff6a6a]/10 border-[#ff6a6a]/30',
    editor: 'text-[#7c6aff] bg-[#7c6aff]/10 border-[#7c6aff]/30',
    viewer: 'text-[#6affb8] bg-[#6affb8]/10 border-[#6affb8]/30',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7c6aff]/20 border border-[#7c6aff]/30 flex items-center justify-center text-[#7c6aff] text-sm font-bold">
              T
            </div>
            <span className="font-bold text-sm">Teamsync</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                roleColors[profile.role]
              }`}
            >
              {profile.role}
            </span>
            {hasPermission(profile.role, 'canViewAdminDashboard') && (
              <Link
                href="/admin"
                className="text-xs text-[#6b6b85] hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
            <form action="/auth/signout" method="POST">
              <button className="text-xs text-[#6b6b85] hover:text-[#ff6a6a] transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employee Directory</h1>
            <p className="text-[#6b6b85] text-sm">
              {employees?.length ?? 0} employees ·{' '}
              <span className="text-white">{profile.role}</span> access
            </p>
          </div>
          {canAdd && (
            <Link
              href="/dashboard/employees/new"
              className="bg-[#7c6aff] hover:bg-[#6a58e8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              + Add Employee
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#111118] border border-[#2a2a3a] rounded-xl p-6">
            <p className="text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
              Total Employees
            </p>
            <p className="text-2xl font-bold text-[#7c6aff]">
              {employees?.length ?? 0}
            </p>
          </div>
          <div className="bg-[#111118] border border-[#2a2a3a] rounded-xl p-6">
            <p className="text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
              Your Role
            </p>
            <p className="text-2xl font-bold text-[#6affb8]">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </p>
          </div>
          <div className="bg-[#111118] border border-[#2a2a3a] rounded-xl p-6">
            <p className="text-xs text-[#6b6b85] uppercase tracking-wider mb-2">
              AI Search
            </p>
            <p className="text-2xl font-bold text-[#ff9d6a]">Active</p>
          </div>
        </div>

        {/* Employee grid */}
        {!employees?.length ? (
          <div className="text-center py-20 text-[#6b6b85]">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-lg mb-2">No employees yet</p>
            {canAdd && (
              <Link
                href="/dashboard/employees/new"
                className="text-[#7c6aff] text-sm hover:underline"
              >
                Add the first one →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(employees as Employee[]).map((emp) => (
              <div
                key={emp.id}
                className="bg-[#111118] border border-[#2a2a3a] hover:border-[#7c6aff]/40 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c6aff] to-[#6affb8] flex items-center justify-center text-white font-bold text-sm">
                    {emp.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  {canDelete && (
                    <button className="opacity-0 group-hover:opacity-100 text-[#ff6a6a] text-xs hover:underline transition-all">
                      Delete
                    </button>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-1">{emp.name}</h3>
                <p className="text-[#7c6aff] text-xs mb-3">{emp.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills
                    .split(',')
                    .slice(0, 3)
                    .map((s: string) => (
                      <span
                        key={s}
                        className="text-xs bg-[#18181f] border border-[#2a2a3a] text-[#6b6b85] px-2 py-0.5 rounded-full"
                      >
                        {s.trim()}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
