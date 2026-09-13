/**
 * Structure commune des pages. Elle garantit une navigation, une largeur de
 * lecture et un pied de page identiques dans toute l’application.
 */
import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Navbar } from './Navbar'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}
