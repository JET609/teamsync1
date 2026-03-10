import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Teamsync — AI Employee Directory',
  description: 'Smart employee directory with AI-powered search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
