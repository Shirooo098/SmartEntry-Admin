import { AdminDrawer } from '#/components/admin/admin-drawer'
import { AdminTable } from '#/components/admin/admin-table'
import { CreateAdminModal } from '#/components/admin/create-admin-modal'
import { PageLayout } from '#/components/page-layout'
import type { AdminUser } from '#/constants/types'
import { useAdminsPage } from '#/hooks/use-admin'
import { useDebounce } from '#/hooks/use-debounce'
import { filterAdmins } from '#/lib/admins-helper'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_auth/admins')({
  component: RouteComponent,
})

function RouteComponent() {
  const { admins, fetching, createAdmin, removeAdmin } = useAdminsPage()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
 
  const filtered = useMemo(
    () => filterAdmins(admins, debouncedSearch),
    [admins, debouncedSearch],
  )
 
  return (
    <PageLayout title="Admin Users">
      <div className="px-4 lg:px-6 space-y-5">
 
        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {[
            { label: 'Total admins', value: admins.length, color: 'text-foreground' },
            { label: 'Active', value: admins.filter(a => a.status === 'active').length, color: 'text-green-500' },
            { label: 'Suspended', value: admins.filter(a => a.status === 'suspended').length, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-semibold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
 
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <IconPlus className="size-4" />
            Add admin
          </button>
        </div>
 
        {/* Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <AdminTable admins={filtered} fetching={fetching} onSelect={setSelected} />
        </div>
      </div>
 
      {selected && (
        <AdminDrawer
          admin={selected}
          onClose={() => setSelected(null)}
          onRemove={async (id) => { await removeAdmin(id); setSelected(null) }}
        />
      )}
 
      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onCreate={async (input) => {
            await createAdmin(input)
            setShowCreate(false)
          }}
        />
      )}
    </PageLayout>
  )
}
