import { auth } from 'FirebaseConfig'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import { useState, useCallback } from 'react'
import { z } from 'zod'
import { getFirebaseError } from '#/lib/firebase-error'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine(d => d.currentPassword !== d.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

export type ChangePasswordFields = z.infer<typeof changePasswordSchema>
export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordFields, string>>

export function useChangePassword() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<ChangePasswordErrors>({})

  const changePassword = useCallback(async (fields: ChangePasswordFields) => {
    setServerError('')
    setSuccess(false)

    const result = changePasswordSchema.safeParse(fields)
    if (!result.success) {
      const fieldErrors: ChangePasswordErrors = {}
      result.error.errors.forEach(e => {
        const field = e.path[0] as keyof ChangePasswordErrors
        fieldErrors[field] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error('No user signed in.')

      const credential = EmailAuthProvider.credential(user.email, result.data.currentPassword)
      await reauthenticateWithCredential(user, credential)

      await updatePassword(user, result.data.newPassword)
      setSuccess(true)
      setErrors({})
    } catch (e) {
      setServerError(getFirebaseError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setServerError('')
    setErrors({})
  }, [])

  return { loading, success, serverError, errors, setErrors, changePassword, reset }
}