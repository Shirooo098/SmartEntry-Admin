import { auth, db } from 'FirebaseConfig'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useEffect, useState, useCallback } from 'react'
import type { AdminUser, CreateAdminInput } from '#/constants/types'
import type { Result } from '#/lib/check-in'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseError } from '#/lib/firebase-error'

async function grantAdmin({email, username, password}: CreateAdminInput): Promise<Result<void>> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      username,
      role: 'admin',
      status: 'active',
      createdAt: serverTimestamp(),
    })

    return { ok: true, data: undefined }
  } catch (e) {
    console.log('grantAdmin error code:', (e as any)?.code)
    console.log('grantAdmin error message:', (e as any)?.message)
    return { ok: false, error: getFirebaseError(e) }
  }
}

async function revokeAdmin(uid: string): Promise<Result<void>> {
  try {
    await updateDoc(doc(db, 'users', uid), { role: 'user', status: 'suspended' })
    return { ok: true, data: undefined }
  } catch {
    return { ok: false, error: 'Failed to revoke admin access.' }
  }
}

export function useAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'admin'),
      orderBy('username', 'asc'),
    )
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        uid: d.id,
        ...d.data(),
      }) as AdminUser)
      setAdmins(data)
      setFetching(false)
    })
    return unsub
  }, [])

  const createAdmin = useCallback(async (input: CreateAdminInput) => {
    const result = await grantAdmin(input)
    if (!result.ok) throw new Error(result.error)
  }, [])

  const removeAdmin = useCallback(async (uid: string) => {
    const result = await revokeAdmin(uid)
    if (!result.ok) throw new Error(result.error)
  }, [])

  return { admins, fetching, createAdmin, removeAdmin }
}