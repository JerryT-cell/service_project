/**
 * Équivalent frontend du Controller : cette page reçoit les critères, appelle
 * le hook et choisit l'état à afficher. Les accès HTTP et le rendu détaillé de
 * chaque artisan restent délégués aux briques spécialisées du slice.
 */
import { CheckIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { ArtisanCard } from './ArtisanCard'
import { ArtisanSearchBar } from './ArtisanSearchBar'
import type { ArtisanSearchParams } from './types'
import { useArtisans } from './useArtisans'

function ArtisanCardSkeleton() {
  return (
    <div className="aspect-square overflow-hidden bg-white">
      <Skeleton className="h-64 rounded-none" />
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-7 w-24 rounded-none" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

export function ArtisansPage() {
  const [params, setParams] = useState<ArtisanSearchParams>({ ville: 'Douala' })
  const { artisans, loading, error, retry } = useArtisans(params)

  return (
    <div className="pb-14">
      <section className="grid items-end gap-10 py-5 sm:py-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:py-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            01 / Trouver le bon pro
          </p>
          <h1 className="mt-6 font-display text-[3.25rem] font-semibold leading-[0.9] tracking-[-0.065em] text-[#353535] sm:text-7xl lg:text-[5.35rem]">
            Des artisans fiables,
            <span className="block">vérifiés, et prêts</span>
            <span className="block">à donner vie à</span>
            <span className="block">vos projets</span>
          </h1>
        </div>

        <div className="max-w-sm lg:pb-2">
          <p className="text-lg leading-7 text-[#30302d]">
            Des profils rencontrés à Douala, vérifiés par notre équipe et prêts
            à parler de votre projet.
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-black/15 pt-4 text-sm font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-none bg-primary text-white">
              <CheckIcon />
            </span>
            100 % des profils affichés sont validés
          </div>
        </div>
      </section>

      <div className="mt-4">
        <ArtisanSearchBar onSearch={setParams} />
      </div>

      <section aria-busy={loading} className="mt-16" aria-live="polite">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              02 / Les profils
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] text-[#171717] sm:text-5xl">
              Disponibles à Douala
            </h2>
          </div>
          {!loading && !error ? (
            <p className="shrink-0 text-sm text-slate-500">
              {artisans.length} {artisans.length === 1 ? 'profil' : 'profils'}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ArtisanCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-none border border-red-100 bg-red-50 p-8 text-center sm:p-12">
            <h3 className="font-display text-xl font-bold text-secondary">
              Impossible de charger les artisans
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              {error.message} Vérifiez votre connexion, puis réessayez.
            </p>
            <Button className="mt-6 rounded-none shadow-none" onClick={retry}>
              <ReloadIcon />
              Réessayer
            </Button>
          </div>
        ) : null}

        {!loading && !error && artisans.length === 0 ? (
          <div className="rounded-none bg-slate-100 px-6 py-16 text-center">
            <h3 className="font-display text-xl font-bold text-secondary">
              Aucun artisan trouvé pour cette recherche
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Essayez un autre métier ou élargissez la ville recherchée.
            </p>
          </div>
        ) : null}

        {!loading && !error && artisans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => (
              <ArtisanCard artisan={artisan} key={artisan.id} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
