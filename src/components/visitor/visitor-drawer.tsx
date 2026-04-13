import type { VisitorWithUser } from '#/constants/types'
import { IconCalendar, IconClock, IconId, IconMail, IconMapPin } from '@tabler/icons-react'
import { DetailRow, Divider, Section } from './visitor-section-detail-row'
import { StatusBadge } from './visitor-status-badge'
import { Avatar } from './visitor-avatar'
import { formatTimestamp } from '#/lib/visitors-helper'

type Props = {
  visitor: VisitorWithUser
  onClose: () => void
}

export function VisitorDrawer({ visitor: v, onClose }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l z-50 overflow-y-auto flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">Visitor details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="flex-1 px-5 py-5 space-y-6">

          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
              {v.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{v.fullName}</p>
              <p className="text-sm text-muted-foreground">{v.email}</p>
              <StatusBadge status={v.status ?? 'Incoming'} />
            </div>
          </div>

          <Divider />

          {/* Visit info */}
          <Section title="Visit info">
            <DetailRow icon={<IconCalendar className="size-4" />} label="Visit date"      value={v.visitDate} />
            <DetailRow icon={<IconCalendar className="size-4" />} label="Checkout date"   value={v.checkoutDate} />
            <DetailRow icon={<IconClock className="size-4" />}    label="Scheduled in"    value={v.scheduledTimeIn} />
            <DetailRow icon={<IconClock className="size-4" />}    label="Scheduled out"   value={v.scheduledTimeOut} />
            <DetailRow icon={<IconClock className="size-4" />}    label="Actual time in"  value={formatTimestamp(v.actualTimeIn)} />
            <DetailRow icon={<IconClock className="size-4" />}    label="Actual time out" value={formatTimestamp(v.actualTimeOut)} />
          </Section>

          <Divider />

          {/* Requested by */}
          <Section title="Requested by">
            {v.user ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={v.user.username} avatarUri={v.user.avatarUri} />
                  <p className="font-medium text-foreground">{v.user.username}</p>
                </div>
                <DetailRow icon={<IconMail className="size-4" />}   label="Email"       value={v.user.email} />
                <DetailRow icon={<IconId className="size-4" />}     label="Resident ID" value={v.user.residential_Id} />
                <DetailRow icon={<IconMapPin className="size-4" />} label="Address"     value={v.address} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User not found</p>
            )}
          </Section>
        </div>
      </div>
    </>
  )
}