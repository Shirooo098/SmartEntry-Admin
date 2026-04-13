import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useAuth } from '#/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { isAuthenticated, isInitialLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialLoading && !isAuthenticated) {
      router.navigate({ to: '/signIn' })
    }
  }, [isAuthenticated, isInitialLoading])

  if (isInitialLoading) {
    return null 
  }

  if (!isAuthenticated) {
    return null 
  }

  return <Outlet />
}