import { FloatingNav } from './FloatingNav'
import { MinimalistFooter } from './MinimalistFooter'

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FloatingNav />
      <main className="flex-1">{children}</main>
      <MinimalistFooter />
    </div>
  )
}
