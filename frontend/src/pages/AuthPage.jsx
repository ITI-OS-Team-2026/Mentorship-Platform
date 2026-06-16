import * as React from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api'

const initialFormState = {
  email: '',
  password: '',
  role: 'Student',
}

function AuthPage() {
  const login = useAuthStore((state) => state.login)
  const [mode, setMode] = React.useState('login')
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState(initialFormState)
  const [errors, setErrors] = React.useState({})
  const [touched, setTouched] = React.useState({})
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  const validate = React.useCallback(
    (nextMode, nextForm) => {
      const nextErrors = {}

      if (!nextForm.email.trim()) {
        nextErrors.email = 'Email is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextForm.email)) {
        nextErrors.email = 'Enter a valid email address.'
      }

      if (!nextForm.password.trim()) {
        nextErrors.password = 'Password is required.'
      } else if (nextForm.password.length < 8) {
        nextErrors.password = 'Use at least 8 characters.'
      }

      if (nextMode === 'register' && !nextForm.role) {
        nextErrors.role = 'Choose a role to continue.'
      }

      return nextErrors
    },
    [],
  )

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setErrors({})
    setTouched({})
    setShowPassword(false)
    setForm((current) => ({
      ...current,
      role: nextMode === 'register' ? current.role || 'Student' : current.role,
    }))
  }

  const fieldError = (name) => (touched[name] ? errors[name] : undefined)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(mode, form)
    setErrors(nextErrors)
    setTouched({ email: true, password: true, role: mode === 'register' })

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setErrors({})

    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'register'
            ? { email: form.email, password: form.password, role: form.role }
            : { email: form.email, password: form.password },
        ),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.message || 'Authentication failed.')
      }

      login(payload)
      setForm(initialFormState)
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[150px] mix-blend-screen" />
        <div className="absolute right-[-8%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-secondary/30 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 md:px-10 lg:px-16">
        <div className="grid w-full place-items-center">
          <section className="relative w-full max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 shadow-2xl backdrop-blur-md md:p-12 text-card-foreground">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Authentication</p>
                  <h2 className="mt-3 text-2xl font-semibold uppercase tracking-tight md:text-4xl">
                    {mode === 'login' ? 'Login' : 'Register'}
                  </h2>
                </div>

                <div className="rounded-full border border-border bg-muted/50 p-1 backdrop-blur-md self-start sm:self-auto">
                  <div className="relative flex rounded-full p-1">
                    <span
                      className={cn(
                        'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-sm transition-transform duration-300 ease-out',
                        mode === 'register' && 'translate-x-full',
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => handleModeChange('login')}
                      className={cn(
                        'relative z-10 rounded-full px-4 py-2 text-sm uppercase tracking-[0.3em] transition-colors',
                        mode === 'login' ? 'text-foreground font-medium' : 'text-muted-foreground',
                      )}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('register')}
                      className={cn(
                        'relative z-10 rounded-full px-4 py-2 text-sm uppercase tracking-[0.3em] transition-colors',
                        mode === 'register' ? 'text-foreground font-medium' : 'text-muted-foreground',
                      )}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-3xl border border-border bg-muted/20">
                    <Skeleton className="h-24 w-full bg-muted/40" />
                  </div>
                  <div className="overflow-hidden border-b-2 border-border/50">
                    <Skeleton className="h-24 w-full rounded-none bg-muted/40" />
                  </div>
                  <div className="overflow-hidden border-b-2 border-border/50">
                    <Skeleton className="h-24 w-full rounded-none bg-muted/40" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-14 w-44 rounded-full bg-muted/40" />
                  </div>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                  {errors.form ? (
                    <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                      {errors.form}
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Email</label>
                    <div className={cn('relative flex items-center gap-3 border-b-2 border-border pb-4 transition-colors hover:border-ring focus-within:border-ring', fieldError('email') && 'border-destructive hover:border-destructive focus-within:border-destructive')}>
                      <Mail className="size-5 shrink-0 text-muted-foreground" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setField('email', event.target.value)}
                        className={cn('w-full bg-transparent text-2xl outline-none placeholder:text-muted-foreground/50 md:text-4xl', fieldError('email') && 'placeholder:text-destructive/40')}
                        placeholder="you@domain.com"
                        autoComplete="email"
                      />
                    </div>
                    {fieldError('email') ? <p className="text-xs uppercase tracking-[0.3em] text-destructive">{fieldError('email')}</p> : null}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Password</label>
                    <div className={cn('relative flex items-center gap-3 border-b-2 border-border pb-4 transition-colors hover:border-ring focus-within:border-ring', fieldError('password') && 'border-destructive hover:border-destructive focus-within:border-destructive')}>
                      <Lock className="size-5 shrink-0 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(event) => setField('password', event.target.value)}
                        className={cn('w-full bg-transparent text-2xl outline-none placeholder:text-muted-foreground/50 md:text-4xl', fieldError('password') && 'placeholder:text-destructive/40')}
                        placeholder="••••••••"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="shrink-0 rounded-full border border-border bg-muted/30 p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {fieldError('password') ? <p className="text-xs uppercase tracking-[0.3em] text-destructive">{fieldError('password')}</p> : null}
                  </div>

                  {mode === 'register' ? (
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Role</label>
                      <Select value={form.role} onValueChange={(value) => setField('role', value)}>
                        <SelectTrigger className={cn("bg-transparent border-border h-14 text-lg", fieldError('role') && 'border-destructive focus:ring-destructive')}>
                          <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Mentor">Mentor</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldError('role') ? <p className="text-xs uppercase tracking-[0.3em] text-destructive">{fieldError('role')}</p> : null}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {mode === 'login' ? 'Access your mentorship workspace.' : 'Create a new mentorship identity.'}
                    </p>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-primary px-8 py-6 text-sm uppercase tracking-[0.35em] text-primary-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 hover:bg-primary/90"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-3">
                          <Loader2 className="size-4 animate-spin" />
                          Working
                        </span>
                      ) : mode === 'login' ? (
                        'Login'
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`@keyframes sweep { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </main>
  )
}

export default AuthPage