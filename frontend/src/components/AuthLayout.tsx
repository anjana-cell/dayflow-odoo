import { Link } from 'react-router-dom'

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="page">
      <div className="card">
        <header className="card-header">
          <p className="eyebrow">Dayflow HRMS</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </header>
        {children}
      </div>
    </div>
  )
}

export function AuthFooter({ text, linkTo, linkLabel }: { text: string; linkTo: string; linkLabel: string }) {
  return (
    <p className="footer-link">
      {text}{' '}
      <Link to={linkTo}>{linkLabel}</Link>
    </p>
  )
}
