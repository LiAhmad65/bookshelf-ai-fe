import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AuthLayout() {
  return (
    <>
      <Navbar />
      <main className="flex justify-center px-4 py-12">
        <div className="w-full max-w-md animate-rise rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-primary/10">
          <p className="mb-4 font-serif text-sm tracking-widest text-accent uppercase">Welcome to your library</p>
          <Outlet />
        </div>
      </main>
    </>
  )
}
