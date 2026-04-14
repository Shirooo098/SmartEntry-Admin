import type { AdminUser } from '#/constants/types'
import { IconMail, IconShield, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

type Props = {
  admin: AdminUser
  onClose: () => void
  onRemove: (uid: string) => Promise<void>
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export function AdminDrawer({ admin, onClose, onRemove }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    setLoading(true)
    try {
      await onRemove(admin.uid)
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l z-50 overflow-y-auto flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">Admin details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>

        <div className="flex-1 px-5 py-5 space-y-6">

          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
              {admin.username?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-foreground">{admin.username}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
              <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                admin.status === 'active'
                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {admin.status ?? 'active'}
              </span>
            </div>
          </div>

          <div className="border-t" />

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account info</p>
            <DetailRow icon={<IconMail className="size-4" />} label="Email" value={admin.email} />
            <DetailRow icon={<IconShield className="size-4" />} label="Role" value={admin.role} />
            <DetailRow
              icon={<IconShield className="size-4" />}
              label="Member since"
              value={admin.createdAt?.toDate ? admin.createdAt.toDate().toLocaleDateString() : '—'}
            />
          </div>

          <div className="border-t" />

          {/* Danger zone */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-red-400 uppercase tracking-wide">Danger zone</p>
            {confirming ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                <p className="text-sm text-foreground">Remove admin access for <strong>{admin.username}</strong>?</p>
                <p className="text-xs text-muted-foreground">This will revoke their ability to access the admin panel.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirming(false)}
                    className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={loading}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-40 transition-colors"
                  >
                    {loading ? 'Removing...' : 'Confirm remove'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors w-full"
              >
                <IconTrash className="size-4" />
                Remove admin access
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}