import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useShopStore, loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '../store/useShopStore'
import { CloseIcon } from './icons'

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    authMode, 
    setAuthModalOpen, 
    setAuthMode, 
    login, 
    signup,
  
  } = useShopStore()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onLoginSubmit = (data: LoginFormData) => {
    const success = login(data.email, data.password)
    if (success) {
      loginForm.reset()
    } else {
      loginForm.setError('root', { message: 'Invalid email or password' })
    }
  }

  const onSignupSubmit = (data: SignupFormData) => {
    const success = signup(data.name, data.email, data.password)
    if (success) {
      signupForm.reset()
    }
  }

  const switchToSignup = () => {
    setAuthMode('signup')
    loginForm.reset()
  }

  const switchToLogin = () => {
    setAuthMode('login')
    signupForm.reset()
  }

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {authMode === 'login' ? 'Sign in to your account' : 'Join us today'}
          </p>
        </div>

        {authMode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            {loginForm.formState.errors.root && (
              <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
                {loginForm.formState.errors.root.message}
              </div>
            )}
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                {...loginForm.register('email')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your email"
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-sm text-rose-500">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                {...loginForm.register('password')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your password"
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-rose-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={switchToSignup}
                className="font-semibold text-sky-500 hover:text-sky-600"
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                {...signupForm.register('name')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your full name"
              />
              {signupForm.formState.errors.name && (
                <p className="mt-1 text-sm text-rose-500">{signupForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                {...signupForm.register('email')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your email"
              />
              {signupForm.formState.errors.email && (
                <p className="mt-1 text-sm text-rose-500">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                {...signupForm.register('password')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Create a password"
              />
              {signupForm.formState.errors.password && (
                <p className="mt-1 text-sm text-rose-500">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                {...signupForm.register('confirmPassword')}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Confirm your password"
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-500">{signupForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchToLogin}
                className="font-semibold text-sky-500 hover:text-sky-600"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}