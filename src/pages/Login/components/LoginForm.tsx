import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AUTH_ROUTES } from '@/config/authRoutes'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface LoginValues {
  email: string
  password: string
}

export function LoginForm() {
  const { login, authMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? PROTECTED_ROUTES.books

  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { email: '', password: '' } })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(null)
    try {
      await login({ email: email.trim(), password })
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to log in'))
    }
  })

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSubmit} noValidate>
      <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
        })}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      {authMessage && !serverError && <p role="alert" className="text-sm text-danger">{authMessage}</p>}
      {serverError && <p role="alert" className="text-sm text-danger">{serverError}</p>}
      <Button type="submit" loading={isSubmitting}>Log in</Button>
      <p className="text-center text-sm text-muted">
        No account? <Link to={AUTH_ROUTES.signup}>Sign up</Link>
      </p>
    </form>
  )
}
