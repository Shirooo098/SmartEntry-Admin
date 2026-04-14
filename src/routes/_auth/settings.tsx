import { ChangePasswordForm } from '#/components/admin/change-password-form'
import { PageLayout } from '#/components/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout title="Settings">
      <div className="px-4 lg:px-6 space-y-5 max-w-2xl">
        <ChangePasswordForm />
      </div>
    </PageLayout>
  )
}
