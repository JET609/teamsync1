export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  await requireAuth('admin')
  const supabase = createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminDashboard initialProfiles={profiles ?? []} />
}
