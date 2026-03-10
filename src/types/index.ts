export type UserRole = 'viewer' | 'editor' | 'admin'

export interface Profile {
  id: string
  email?: string
  full_name: string | null
  avatar_url?: string | null
  role: UserRole
  company_id: string | null
  is_disabled?: boolean
  created_at: string
  updated_at?: string
}

export interface Employee {
  id: string
  company_id: string | null
  name: string
  title: string
  department: string | null
  skills: string
  bio: string | null
  email: string | null
  availability: string
  avatar_url?: string | null
  created_by?: string | null
  created_at: string
  updated_at?: string
}

export const PERMISSIONS = {
  viewer: {
    canViewDirectory: true,
    canUseAIChat: true,
    canAddEmployee: false,
    canEditEmployee: false,
    canDeleteEmployee: false,
    canManageRoles: false,
    canViewAdminDashboard: false,
  },
  editor: {
    canViewDirectory: true,
    canUseAIChat: true,
    canAddEmployee: false,
    canEditEmployee: true,
    canDeleteEmployee: false,
    canManageRoles: false,
    canViewAdminDashboard: false,
  },
  admin: {
    canViewDirectory: true,
    canUseAIChat: true,
    canAddEmployee: true,
    canEditEmployee: true,
    canDeleteEmployee: true,
    canManageRoles: true,
    canViewAdminDashboard: true,
  },
} as const

export function hasPermission(
  role: UserRole,
  permission: keyof (typeof PERMISSIONS)['admin']
): boolean {
  return PERMISSIONS[role][permission]
}
