import { ApolloWrapper } from '@/components/ApolloWrapper'
import { N8nChat } from '@/components/N8nChat'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slooze - Commodities Management System',
  description: 'Role-based commodities management system with Next.js, TypeScript, and GraphQL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ApolloWrapper>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <N8nChat />
            </AuthProvider>
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
