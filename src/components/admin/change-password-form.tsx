import { useChangePassword } from '#/hooks/use-change-password'
import { IconCheck } from '@tabler/icons-react'
import { useState } from 'react'

type FieldKeys = 'currentPassword' | 'newPassword' | 'confirmPassword'

type FieldConfig = {
  key: FieldKeys
  label: string
  placeholder: string
}

const FIELDS: FieldConfig[] = [
  { key: 'currentPassword', label: 'Current password',  placeholder: '••••••' },
  { key: 'newPassword',     label: 'New password',      placeholder: '••••••' },
  { key: 'confirmPassword', label: 'Confirm password',  placeholder: '••••••' },
]

export function ChangePasswordForm() {
  const { loading, success, serverError, errors, setErrors, changePassword, reset } = useChangePassword()
  const [fields, setFields] = useState<Record<FieldKeys, string>>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  function setField(key: FieldKeys) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(prev => ({ ...prev, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit() {
    await changePassword(fields)
    if (success) {
      setFields({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="text-sm font-semibold">Change password</p>
        <p className="text-xs text-muted-foreground mt-0.5">Update your admin account password</p>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-sm">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <input
              type="password"
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

        {success && (
          <div className="flex items-center gap-2 text-green-500">
            <IconCheck className="size-4" />
            <p className="text-xs font-medium">Password changed successfully.</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </div>
    </div>
  )
}