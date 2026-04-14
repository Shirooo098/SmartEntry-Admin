import type { AdminUser } from '#/constants/types'

export function filterAdmins(admins: AdminUser[], search: string): AdminUser[] {
  if (!search) return admins
  const q = search.toLowerCase()
  return admins.filter(a =>
    a.username?.toLowerCase().includes(q) ||
    a.email?.toLowerCase().includes(q)
  )
}