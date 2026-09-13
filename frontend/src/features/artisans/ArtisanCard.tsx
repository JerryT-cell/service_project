/**
 * Carte de présentation pure et réutilisable : elle reçoit un DTO déjà chargé
 * et n'effectue aucun appel réseau. Une liste, une recherche ou la future page
 * d'accueil peuvent donc l'utiliser sans dupliquer l'affichage.
 */
import {
  ArrowTopRightIcon,
  CheckIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { ArtisanResume } from './types'

interface ArtisanCardProps {
  artisan: ArtisanResume
}

const PALETTES = [
  'bg-[#cec8ff]',
  'bg-[#e8ce95]',
  'bg-[#bfe4d2]',
  'bg-[#c8e0f5]',
] as const

function getInitiales(nom: string): string {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((partie) => partie.charAt(0))
    .join('')
    .toUpperCase()
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const localisation = [artisan.quartier, artisan.ville]
    .filter(Boolean)
    .join(', ')
  const couleur = PALETTES[(artisan.id - 1) % PALETTES.length]

  return (
    <Link
      aria-label={`Voir le profil de ${artisan.nomAffichage}`}
      className="group block aspect-square focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      to={`/artisans/${artisan.id}`}
    >
      <Card
        className={cn(
          'relative flex aspect-square h-full flex-col overflow-hidden rounded-none border-0 p-5 text-[#282828] shadow-none transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_55px_rgba(30,25,15,0.13)] sm:p-6',
          couleur,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {artisan.verifie ? (
            <Badge className="rounded-none border-0 bg-white/75 px-3 py-1.5 text-primary shadow-none backdrop-blur-sm hover:bg-white/75">
              <CheckIcon className="mr-1 h-3.5 w-3.5" />
              Vérifié par Briko
            </Badge>
          ) : (
            <span />
          )}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-black/20 transition group-hover:rotate-6 group-hover:bg-[#242424] group-hover:text-white">
            <ArrowTopRightIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center py-3">
          <Avatar className="h-24 w-24 rounded-none border-0 bg-white/35 shadow-none transition duration-500 group-hover:rotate-[-3deg] group-hover:scale-105 sm:h-28 sm:w-28">
            {artisan.photoProfilUrl ? (
              <AvatarImage
                alt={`Portrait de ${artisan.nomAffichage}`}
                className="rounded-none object-cover"
                src={artisan.photoProfilUrl}
              />
            ) : null}
            <AvatarFallback className="rounded-none bg-white/35 font-display text-3xl font-semibold tracking-[-0.06em] text-[#282828] sm:text-4xl">
              {getInitiales(artisan.nomAffichage)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {artisan.categories.map((categorie) => (
              <Badge
                className="rounded-none border-0 bg-[#242424] px-2.5 py-1 font-medium text-white"
                key={categorie}
              >
                {categorie}
              </Badge>
            ))}
          </div>
          <h2 className="font-display text-2xl font-semibold leading-none tracking-[-0.045em] sm:text-[1.7rem]">
            {artisan.nomAffichage}
          </h2>
          <div className="mt-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <p className="truncate text-black/60">{localisation}</p>
            <p className="flex shrink-0 items-center gap-1 font-semibold">
              <StarFilledIcon className="h-4 w-4 text-amber-600" />
              {artisan.noteMoyenne.toFixed(1)} · {artisan.nombreAvis} avis
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
