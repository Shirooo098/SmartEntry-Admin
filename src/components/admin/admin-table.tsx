import type { AdminUser } from '#/constants/types'
import { IconUser } from '@tabler/icons-react'

type Props = {
  admins: AdminUser[]
  fetching: boolean
  onSelect: (admin: AdminUser) => void
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active:    'bg-green-500/10 text-green-500 border-green-500/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function AdminTable({ admins, fetching, onSelect }: Props) {
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 border-muted border-t-foreground animate-spin" />
      </div>
    )
  }

  if (admins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <IconUser className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No admin users found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Admin</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {admins.map(admin => (
            <tr
              key={admin.id}
              onClick={() => onSelect(admin)}
              className="hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                    {admin.username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className="font-medium text-foreground">{admin.username}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={admin.status ?? 'active'} />
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {admin.createdAt?.toDate
                  ? admin.createdAt.toDate().toLocaleDateString()
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}