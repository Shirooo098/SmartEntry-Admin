import type { Entry, User, Visitor } from '#/constants/types';
import { db } from 'FirebaseConfig'
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  limit,
  query,
  type DocumentData,
  updateDoc,
} from 'firebase/firestore'

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

function toEntry(id: string, d: DocumentData, user: User | null): Entry {
  return {
    id,
    visitorId: d.visitorId ?? '',
    fullName: d.fullName ?? 'Unknown',
    email: d.email ?? '',
    username: user?.username ?? '',
    residential_Id: user?.residential_Id ?? '',
    time: d.actualTimeIn?.toDate
      ? d.actualTimeIn.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--',
    status: d.actualTimeOut ? 'out' : 'in',
  }
}


export async function findVisitorById(id: string): Promise<Result<Visitor>> {
  console.log('Looking up visitor with id:', id)
  try {
    const snap = await getDoc(doc(db, 'visitors', id))
    if (!snap.exists()) return { ok: false, error: 'Visitor not registered.' }

    const visitor = { id: snap.id, ...snap.data() } as Visitor

    if (visitor.status === 'Visitor-Out') {
      return { ok: false, error: 'Visitor has already checked out.' }
    }

    return { ok: true, data: visitor }
  } catch (e) {
    console.log('error:', e)
    return { ok: false, error: 'Failed to look up visitor.' }
  }
}


export async function recordEntry(
  visitorId: string,
  visitor: Visitor
): Promise<Result<void>> {
  try {
    const visitorRef = doc(db, 'visitors', visitorId)

    const update = visitor.actualTimeIn
      ? { actualTimeOut: serverTimestamp(), status: 'Visitor-Out' }
      : { actualTimeIn: serverTimestamp(), status: 'Visitor-In' }

    await updateDoc(visitorRef, update)
    return { ok: true, data: undefined }
  } catch (e) {
    console.log('recordEntry error:', e)
    return { ok: false, error: 'Failed to record entry.' }
  }
}

async function findUserByUid(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    return { uid: snap.id, ...snap.data() } as User
  } catch {
    return null
  }
}

export async function fetchRecentEntries(): Promise<Result<Entry[]>> {
  try {
    const q = query(
      collection(db, 'visitors'),
      orderBy('actualTimeIn', 'desc'),
      limit(8)
    )
    const snap = await getDocs(q)
    const entries = await Promise.all(
      snap.docs.map(async (entryDoc) => {
        const d = entryDoc.data()
        const user = d.uid ? await findUserByUid(d.uid) : null
        return toEntry(entryDoc.id, d, user)
      })
    )
    return { ok: true, data: entries }
  } catch (e) {
    return { ok: false, error: 'Failed to fetch recent entries.' }
  }
}