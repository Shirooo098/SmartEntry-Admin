import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useAuth } from '#/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { isAuthenticated, isInitialLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialLoading) return

    if (!isAuthenticated) {
      router.navigate({ to: '/signIn' })
      return
    }

    if (!isAdmin) {
      router.navigate({ to: '/signIn' })
      return
    }
  }, [isAuthenticated, isInitialLoading, isAdmin])

  if (isInitialLoading) return null
  if (!isAuthenticated || !isAdmin) return null

  return <Outlet />
}