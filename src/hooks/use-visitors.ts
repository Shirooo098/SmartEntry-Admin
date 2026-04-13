import type { User, Visitor, VisitorWithUser } from '#/constants/types'
import { db } from 'FirebaseConfig'
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

async function fetchUsers(): Promise<Map<string, User>> {
  const snap = await getDocs(collection(db, 'users'))
  const map = new Map<string, User>()
  snap.docs.forEach(d => map.set(d.id, { uid: d.id, ...d.data() } as User))
  return map
}

export function useVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorWithUser[]>([])
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => {
        const visitor = { id: d.id, ...d.data() } as Visitor
        return { ...visitor, user: users.get(visitor.uid) ?? null }
      })
      setVisitors(data)
      setFetching(false)
    })
    return unsub
  }, [users])

  return { visitors, fetching }
}