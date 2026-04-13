import type { VisitorWithUser } from '#/constants/types'
import { IconUser } from '@tabler/icons-react'
import { StatusBadge } from './visitor-status-badge'
import { formatTimestamp } from '#/lib/visitors-helper'
import { Avatar } from './visitor-avatar'


type Props = {
  visitors: VisitorWithUser[]
  fetching: boolean
  onSelect: (v: VisitorWithUser) => void
}

export function VisitorTable({ visitors, fetching, onSelect }: Props) {
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 border-muted border-t-foreground animate-spin" />
      </div>
    )
  }

  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <IconUser className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No visitors found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {['Visitor', 'Requested by', 'Visit date', 'Schedule', 'Status', 'Actual time in'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {visitors.map(v => (
            <tr
              key={v.id}
              onClick={() => onSelect(v)}
              className="hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                    {v.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{v.fullName}</p>
                    <p className="text-xs text-muted-foreground">{v.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={v.user?.username ?? '?'} avatarUri={v.user?.avatarUri} />
                  <div>
                    <p className="font-medium text-foreground">{v.user?.username ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{v.user?.residential_Id ?? '—'}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{v.visitDate}</td>
              <td className="px-4 py-3 text-muted-foreground">{v.scheduledTimeIn} — {v.scheduledTimeOut}</td>
              <td className="px-4 py-3"><StatusBadge status={v.status ?? 'Incoming'} /></td>
              <td className="px-4 py-3 text-muted-foreground">{formatTimestamp(v.actualTimeIn)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}