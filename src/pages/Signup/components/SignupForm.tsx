import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AUTH_ROUTES } from '@/config/authRoutes'
import { PROTECTED_ROUTES } from '@/config/ProtectedRoutes'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/utils/getErrorMessage'

const MIN_PASSWORD_LENGTH = 8

interface SignupValues {
  name: string
  email: string
  password: string
}

export function SignupForm() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ defaultValues: { name: '', email: '', password: '' } })

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setServerError(null)
    try {
      await signup({ name: name.trim(), email: email.trim(), password })
      navigate(PROTECTED_ROUTES.books, { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to sign up'))
    }
  })

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSubmit} noValidate>
      <h1 className="mb-2 text-2xl font-bold">Create account</h1>
      <Input
        label="Name"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register('name', {
          validate: (value) => value.trim().length > 0 || 'Name is required',
        })}
      />
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
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
        required
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: MIN_PASSWORD_LENGTH, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        })}
      />
      {serverError && <p role="alert" className="text-sm text-danger">{serverError}</p>}
      <Button type="submit" loading={isSubmitting}>Sign up</Button>
      <p className="text-center text-sm text-muted">
        Already have an account? <Link to={AUTH_ROUTES.login}>Log in</Link>
      </p>
    </form>
  )
}
