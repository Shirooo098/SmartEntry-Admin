import type { Entry } from "#/constants/types"
import type { ScannedUser, ScanStatus } from "#/hooks/use-check-in"
import { IconCheck, IconClock, IconQrcode, IconUser, IconX } from "@tabler/icons-react"


export type ScannerViewportProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  cameraActive: boolean
  scanStatus: ScanStatus
  scanMessage: string
  scannedUser: ScannedUser | null
  cameraError: string
  onStart: () => void
  onRetry: () => void
}
 
export function ScannerViewport({
  videoRef, canvasRef, cameraActive, scanStatus,
  scanMessage, scannedUser, cameraError, onStart, onRetry,
}: ScannerViewportProps) {
  return (
    <div className="relative bg-black aspect-video w-full flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        style={{ display: cameraActive && scanStatus === 'idle' ? 'block' : 'none' }}
      />
      <canvas ref={canvasRef} className="hidden" />
      {!cameraActive && scanStatus === 'idle' && <IdleState error={cameraError} onStart={onStart} />}
      {scanStatus === 'loading' && <LoadingOverlay />}
      {scanStatus === 'success' && <SuccessOverlay user={scannedUser} message={scanMessage} />}
      {scanStatus === 'error' && <ErrorOverlay message={scanMessage} onRetry={onRetry} />}
      {cameraActive && scanStatus === 'idle' && <ScanFrame />}
    </div>
  )
}
 
export function IdleState({ error, onStart }: { error: string; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <IconQrcode className="size-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Camera is off</p>
      <button
        onClick={onStart}
        className="px-5 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Start Camera
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
 
export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  )
}
 
export function SuccessOverlay({ user, message }: { user: ScannedUser | null; message: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
      <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
        <IconCheck className="size-8 text-green-400" />
      </div>
      {user && (
        <div className="text-center">
          <p className="text-white font-medium">{user.fullName}</p>
          <p className="text-white/60 text-sm">{user.email}</p>
        </div>
      )}
      <p className="text-green-400 text-sm">{message}</p>
    </div>
  )
}
 
export function ErrorOverlay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
      <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
        <IconX className="size-8 text-red-400" />
      </div>
      <p className="text-red-400 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="text-xs text-white/60 underline underline-offset-2 hover:text-white"
      >
        Try again
      </button>
    </div>
  )
}
 
export function ScanFrame() {
  const corners = [
    'top-0 left-0 border-t-2 border-l-2',
    'top-0 right-0 border-t-2 border-r-2',
    'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-0 right-0 border-b-2 border-r-2',
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-52 h-52">
        {corners.map((cls, i) => (
          <span key={i} className={`absolute w-6 h-6 border-white/80 ${cls}`} />
        ))}
      </div>
    </div>
  )
}
 
export function CameraControls({ onStop }: { onStop: () => void }) {
  return (
    <div className="px-4 py-3 border-t flex items-center justify-between">
      <p className="text-xs text-muted-foreground">Point camera at a visitor QR code</p>
      <button
        onClick={onStop}
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
      >
        Stop camera
      </button>
    </div>
  )
}
 
type ManualEntryProps = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled: boolean
}
 
export function ManualEntry({ value, onChange, onSubmit, disabled }: ManualEntryProps) {
  return (
    <div className="px-4 py-4 border-t">
      <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Manual entry</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Visitor ID or email"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
 
export function RecentEntriesPanel({ entries }: { entries: Entry[] }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <span className="text-sm font-medium">Recent entries</span>
        <IconClock className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 divide-y overflow-y-auto">
        {entries.length === 0 ? <EmptyEntries /> : entries.map(e => <EntryRow key={e.id} entry={e} />)}
      </div>
    </div>
  )
}
 
export function EmptyEntries() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
      <IconUser className="size-6 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">No entries yet today</p>
    </div>
  )
}
 
export function EntryRow({ entry }: { entry: Entry }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
        {entry.fullName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{entry.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">{entry.email}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground">{entry.time}</p>
        <span className={`text-xs font-medium ${entry.status === 'in' ? 'text-green-500' : 'text-orange-400'}`}>
          {entry.status === 'in' ? 'In' : 'Out'}
        </span>
      </div>
    </div>
  )
}
 