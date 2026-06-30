import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'

const getDashboardUrl = (role) => {
  switch (role) {
    case 'Admin': return '/admin/dashboard';
    case 'Mentor': return '/mentor/dashboard';
    case 'Student': return '/student/dashboard';
    default: return '/';
  }
}

export function MinimalistFooter() {
  const { user, isAuthenticated } = useAuthStore()
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-sm font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          MentHub
        </Link>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground text-center">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>

        {/* Links */}
        <nav className="flex items-center gap-6">
          <Link
            to="/mentors"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('footer.mentors')}
          </Link>
          
          {isAuthenticated ? (
            <Link
              to={getDashboardUrl(user?.role)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.dashboard')}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.login')}
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
