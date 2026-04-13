import type { StatusFilter, VisitorWithUser } from '#/constants/types';
import { Timestamp } from 'firebase/firestore'

export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  Incoming:    { label: 'Incoming',    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  'Visitor-In':  { label: 'Visitor In',  className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  'Visitor-Out': { label: 'Visitor Out', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
}

export const STATUS_FILTERS: StatusFilter[] = ['All', 'Incoming', 'Visitor-In', 'Visitor-Out']

export const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  All: 'All',
  Incoming: 'Incoming',
  'Visitor-In': 'In',
  'Visitor-Out': 'Out',
}

export function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return '—'
  return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function filterVisitors(
  visitors: VisitorWithUser[],
  search: string,
  statusFilter: StatusFilter,
): VisitorWithUser[] {
  return visitors.filter(v => {
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      [v.fullName, v.email, v.user?.username, v.user?.residential_Id].some(s =>
        s?.toLowerCase().includes(q),
      )
    return matchesStatus && matchesSearch
  })
}

export function countByStatus(visitors: VisitorWithUser[]) {
  return {
    all: visitors.length,
    incoming: visitors.filter(v => v.status === 'Incoming').length,
    in: visitors.filter(v => v.status === 'Visitor-In').length,
    out: visitors.filter(v => v.status === 'Visitor-Out').length,
  }
}