import { PageLayout } from '#/components/page-layout'
import { VisitorDrawer } from '#/components/visitor/visitor-drawer'
import { VisitorTable } from '#/components/visitor/visitor-table'
import type { StatusFilter, VisitorWithUser } from '#/constants/types'
import { useDebounce } from '#/hooks/use-debounce'
import { useVisitorsPage } from '#/hooks/use-visitors'
import { countByStatus, filterVisitors, STATUS_FILTER_LABEL, STATUS_FILTERS } from '#/lib/visitors-helper'
import { IconFilter, IconSearch } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_auth/visitors')({
  component: RouteComponent,
})

const STATS = (counts: ReturnType<typeof countByStatus>) => [
  { label: 'Total',       value: counts.all,      color: 'text-foreground' },
  { label: 'Incoming',    value: counts.incoming,  color: 'text-amber-500' },
  { label: 'Visitor In',  value: counts.in,        color: 'text-green-500' },
  { label: 'Visitor Out', value: counts.out,       color: 'text-slate-400' },
]

function RouteComponent() {
  const { visitors, fetching } = useVisitorsPage()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [selected, setSelected] = useState<VisitorWithUser | null>(null)
  const debouncedSearch = useDebounce(search, 300) 

  const filtered = useMemo(
    () => filterVisitors(visitors, debouncedSearch, statusFilter), 
    [visitors, debouncedSearch, statusFilter],
  )

  const counts = useMemo(() => countByStatus(visitors), [visitors])

  return (
    <PageLayout title="Visitors">
      <div className="px-4 lg:px-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS(counts).map(s => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-semibold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, resident ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <IconFilter className="size-4 text-muted-foreground shrink-0" />
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  statusFilter === s
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/40'
                }`}
              >
                {STATUS_FILTER_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <VisitorTable visitors={filtered} fetching={fetching} onSelect={setSelected} />
        </div>
      </div>

      {selected && <VisitorDrawer visitor={selected} onClose={() => setSelected(null)} />}
    </PageLayout>
  )
}