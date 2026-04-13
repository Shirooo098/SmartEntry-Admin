import { CameraControls, ManualEntry, RecentEntriesPanel, ScannerViewport } from '#/components/check-in/scanner'
import { PageLayout } from '#/components/page-layout'
import { useCamera } from '#/hooks/use-camera'
import { useCheckIn} from '#/hooks/use-check-in'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/check-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const { scanStatus, scanMessage, scannedUser, recentEntries, handleScan, reset } = useCheckIn()
  const { videoRef, canvasRef, active, error, start, stop } = useCamera(handleScan)
  const [manualInput, setManualInput] = useState('')
 
  function handleManualSubmit() {
    if (!manualInput.trim()) return
    handleScan(manualInput.trim())
    setManualInput('')
  }
 
  function handleRetry() {
    reset()
    start()
  }
  return (
    <PageLayout title='Check-In'>
      <div className="px-4 lg:px-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
            <ScannerViewport
              videoRef={videoRef}
              canvasRef={canvasRef}
              cameraActive={active}
              scanStatus={scanStatus}
              scanMessage={scanMessage}
              scannedUser={scannedUser}
              cameraError={error}
              onStart={start}
              onRetry={handleRetry}
            />
            {active && scanStatus === 'idle' && <CameraControls onStop={stop} />}
            <ManualEntry
              value={manualInput}
              onChange={setManualInput}
              onSubmit={handleManualSubmit}
              disabled={scanStatus === 'loading'}
            />
          </div>
          <RecentEntriesPanel entries={recentEntries} />
        </div>
      </div>
    </PageLayout>
  )
}
