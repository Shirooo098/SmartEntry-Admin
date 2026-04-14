import type { Visitor } from '#/constants/types'
import { db } from 'FirebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type ChartDataPoint = {
  date: string        // "MM/DD/YYYY" for display
  timestamp: number   // ms since epoch for reliable filtering + sorting
  total: number
  incoming: number
  visitorIn: number
  visitorOut: number
}

export function useVisitorChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'visitors'))
      const visitors = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Visitor)

      const grouped = new Map<string, ChartDataPoint>()

      visitors.forEach(v => {
        if (!v.createdAt || v.createdAt === null) return

        const date = v.createdAt.toDate()

        // Normalize to midnight so same-day entries group correctly
        const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const timestamp = normalized.getTime()

        const key = [
          String(normalized.getMonth() + 1).padStart(2, '0'),
          String(normalized.getDate()).padStart(2, '0'),
          normalized.getFullYear(),
        ].join('/')

        if (!grouped.has(key)) {
          grouped.set(key, { date: key, timestamp, total: 0, incoming: 0, visitorIn: 0, visitorOut: 0 })
        }

        const entry = grouped.get(key)!
        entry.total++
        if (v.status === 'Incoming')    entry.incoming++
        if (v.status === 'Visitor-In')  entry.visitorIn++
        if (v.status === 'Visitor-Out') entry.visitorOut++
      })

      const sorted = Array.from(grouped.values()).sort((a, b) => a.timestamp - b.timestamp)

      setChartData(sorted)
      setLoading(false)
    }

    load()
  }, [])

  return { chartData, loading }
}