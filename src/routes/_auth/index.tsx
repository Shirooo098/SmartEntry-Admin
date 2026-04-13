import { PageLayout } from '#/components/page-layout'
import { ChartAreaInteractive } from '#/components/chart-area-interactive'
import { DataTable } from '#/components/data-table'
import { createFileRoute } from '@tanstack/react-router'
import data from "data.json"

export const Route = createFileRoute('/_auth/')({ component: DashboardPage })

function DashboardPage() {
  return (
    <PageLayout>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </PageLayout>
  )
}