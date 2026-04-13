import type { Entry } from '#/constants/types'
import { fetchRecentEntries, findVisitorById, recordEntry} from '#/lib/check-in'
import { useState, useCallback, useEffect, useRef } from 'react'

export type ScanStatus = 'idle' | 'loading' | 'success' | 'error'

export type ScannedUser = {
  fullName: string
  email: string
}

export function useCheckIn() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
  const [scanMessage, setScanMessage] = useState('')
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null)
  const [recentEntries, setRecentEntries] = useState<Entry[]>([])
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadRecentEntries()
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const loadRecentEntries = useCallback(async () => {
    const result = await fetchRecentEntries()
    if (result.ok) setRecentEntries(result.data)
  }, [])

  const reset = useCallback(() => {
    setScanStatus('idle')
    setScanMessage('')
    setScannedUser(null)
  }, [])

  const scheduleReset = useCallback(() => {
    resetTimerRef.current = setTimeout(reset, 3000)
  }, [reset])

  const handleScan = useCallback(async (raw: string) => {
    if (scanStatus === 'loading') return
    setScanStatus('loading')

    const visitorResult = await findVisitorById(raw)
    if (!visitorResult.ok) {
      setScanStatus('error')
      setScanMessage(visitorResult.error)
      scheduleReset()
      return
    }

    const visitor = visitorResult.data
    const entryResult = await recordEntry(visitor.id, visitor)
    if (!entryResult.ok) {
      setScanStatus('error')
      setScanMessage(entryResult.error)
      scheduleReset()
      return
    }

    setScannedUser({ fullName: visitor.fullName, email: visitor.email })
    setScanStatus('success')
    setScanMessage('Entry recorded.')
    loadRecentEntries()
    scheduleReset()
  }, [scanStatus, scheduleReset, loadRecentEntries])

  return {
    scanStatus,
    scanMessage,
    scannedUser,
    recentEntries,
    handleScan,
    reset,
  }
}