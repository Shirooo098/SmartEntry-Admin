import type { CreateAdminInput } from "#/constants/types"
import { useState } from "react"
import { z } from "zod"

type FieldKeys = 'email' | 'username' | 'password' | 'confirmPassword'

type FieldConfig = {
  key: FieldKeys
  label: string
  type: 'email' | 'text' | 'password'
  placeholder: string
}

const FIELDS: FieldConfig[] = [
  { key: 'email',           label: 'Email',            type: 'email',    placeholder: 'admin@example.com' },
  { key: 'username',        label: 'Username',         type: 'text',     placeholder: 'Display name' },
  { key: 'password',        label: 'Password',         type: 'password', placeholder: '••••••' },
  { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••' },
]

const adminSchema = z.object({
  email: z.string().email('Enter a valid email'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type AdminFormErrors = Partial<Record<'email' | 'username' | 'password' | 'confirmPassword', string>>

export function CreateAdminModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (input: CreateAdminInput) => Promise<void>
}) {
  const [fields, setFields] = useState({ email: '', username: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<AdminFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function setField(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(prev => ({ ...prev, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit() {
    setServerError('')
    const result = adminSchema.safeParse(fields)

    if (!result.success) {
      const fieldErrors: AdminFormErrors = {}
      result.error.errors.forEach(e => {
        const field = e.path[0] as keyof AdminFormErrors
        fieldErrors[field] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...input } = result.data
      await onCreate(input)
    } catch (e: any) {
      setServerError(e.message ?? 'Failed to create admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-xl border w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-sm font-semibold">Add admin user</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
          </div>

          <div className="px-5 py-5 space-y-4">
            <p className="text-xs text-muted-foreground">
              This will create a new account with admin access.
            </p>

            {FIELDS.map(({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={fields[key]}
                  onChange={setField(key)}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors[key] ? 'border-destructive' : ''
                  }`}
                />
                {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
              </div>
            ))}
            {serverError && <p className="text-xs text-destructive">{serverError}</p>}
          </div>

          <div className="flex gap-2 px-5 py-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {loading ? 'Adding...' : 'Add admin'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}