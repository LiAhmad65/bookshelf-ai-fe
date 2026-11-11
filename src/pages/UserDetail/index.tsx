import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usersApi } from '@/api/users/usersApi'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { useAsync } from '@/hooks/useAsync'

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '')

export default function UserDetail() {
  const { id = '' } = useParams()
  const fetchUser = useCallback((signal: AbortSignal) => usersApi.get(id, signal), [id])
  const { data: user, error, isLoading } = useAsync(fetchUser)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <Link to={PROTECTED_ROUTES.books} className="mb-6 self-start text-sm">← Back to books</Link>
      {isLoading && <Spinner />}
      {error && <p role="alert" className="text-danger">{error}</p>}
      {user && (
        <Card className="w-full animate-rise p-6 sm:p-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-primary">User details</h1>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={user.name ?? ''} readOnly />
            <Input label="Email" value={user.email ?? ''} readOnly />
            {user.createdAt && <Input label="Joined" value={formatDate(user.createdAt)} readOnly />}
            {user.updatedAt && <Input label="Last updated" value={formatDate(user.updatedAt)} readOnly />}
          </div>
        </Card>
      )}
    </div>
  )
}
