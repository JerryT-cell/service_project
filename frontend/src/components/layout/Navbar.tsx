/**
 * Navigation principale de Briko. Elle adapte les actions à la session et
 * replie les liens dans un panneau latéral sur les petits écrans.
 */
import { useState } from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/useAuth'

export function Navbar() {
  const { utilisateur, isAuthentifie, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f3ea]/90 backdrop-blur-xl">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link className="font-display text-2xl font-semibold tracking-[-0.055em]" to="/">
          bri<span className="text-primary">ko</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink
            className={({ isActive }) =>
              `flex h-[76px] items-center border-b-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary text-secondary'
                  : 'border-transparent text-slate-500 hover:text-secondary'
              }`
            }
            to="/artisans"
          >
            Artisans
          </NavLink>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthentifie ? (
            <>
              <span className="mr-2 max-w-44 truncate text-sm font-medium text-slate-600">
                {utilisateur?.nom}
              </span>
              <Button className="rounded-none" onClick={logout} variant="ghost">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="rounded-none" variant="ghost">
                <Link to="/connexion">Connexion</Link>
              </Button>
              <Button asChild className="rounded-none px-5 shadow-none">
                <Link to="/inscription">Inscription</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet onOpenChange={setIsMenuOpen} open={isMenuOpen}>
          <SheetTrigger asChild>
            <Button
              aria-label="Ouvrir le menu"
              className="rounded-none md:hidden"
              size="icon"
              variant="ghost"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="border-l-0 bg-white p-7" side="right">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl font-semibold tracking-[-0.055em]">
                bri<span className="text-primary">ko</span>
              </SheetTitle>
              <SheetDescription>
                Des artisans vérifiés à Douala.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-10 flex flex-col gap-3">
              <Button asChild className="h-12 justify-start rounded-none" variant="ghost">
                <Link onClick={() => setIsMenuOpen(false)} to="/artisans">
                  Artisans
                </Link>
              </Button>

              {isAuthentifie ? (
                <>
                  <p className="px-4 pt-4 text-sm text-slate-500">
                    Connecté en tant que
                  </p>
                  <p className="px-4 font-semibold">{utilisateur?.nom}</p>
                  <Button
                    className="mt-3 h-12 rounded-none"
                    onClick={handleLogout}
                    variant="outline"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <div className="mt-5 grid gap-3">
                  <Button asChild className="h-12 rounded-none" variant="outline">
                    <Link onClick={() => setIsMenuOpen(false)} to="/connexion">
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild className="h-12 rounded-none shadow-none">
                    <Link onClick={() => setIsMenuOpen(false)} to="/inscription">
                      Inscription
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
