/**
 * Page de profil : elle lit l'identifiant de la route, délègue la récupération
 * au hook useArtisan et coordonne les états d'attente, d'erreur et de succès.
 */
import {
  ArrowLeftIcon,
  CheckIcon,
  ChatBubbleIcon,
  MobileIcon,
  ReloadIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { Link, useParams } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiClientError } from '@/lib/apiClient'
import { formatTelephone } from '@/lib/utils'

import type { ArtisanDetail } from './types'
import { useArtisan } from './useArtisan'

function getInitiales(nom: string): string {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((partie) => partie.charAt(0))
    .join('')
    .toUpperCase()
}

function formatDate(date: string | null): string | null {
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function ContactActions({ artisan }: { artisan: ArtisanDetail }) {
  const numeroCompact = artisan.telephone.replace(/\D/g, '')

  return (
    <div className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-2 gap-3 rounded-none border border-slate-200 bg-white/95 p-3 shadow-[0_12px_35px_rgba(15,23,42,0.16)] backdrop-blur-lg lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <Button asChild className="h-12 rounded-none text-base shadow-none">
        <a href={`tel:${artisan.telephone}`}>
          <MobileIcon />
          Appeler
        </a>
      </Button>
      <Button asChild className="h-12 rounded-none text-base shadow-none">
        <a
          href={`https://wa.me/${numeroCompact}`}
          rel="noreferrer"
          target="_blank"
        >
          <ChatBubbleIcon />
          WhatsApp
        </a>
      </Button>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="Chargement du profil" role="status">
      <Skeleton className="h-5 w-40" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-none border border-slate-200 bg-white">
          <Skeleton className="h-64 rounded-none" />
          <div className="space-y-4 p-7">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="space-y-4 rounded-none border border-slate-200 bg-white p-6">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-12 w-full rounded-none" />
        </div>
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  )
}

export function ArtisanDetailPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const idConverti = Number(idParam)
  const id =
    Number.isInteger(idConverti) && idConverti > 0 ? idConverti : undefined
  const { artisan, loading, error, retry } = useArtisan(id)
  const isNotFound =
    id === undefined || (error instanceof ApiClientError && error.status === 404)

  if (loading) {
    return <DetailSkeleton />
  }

  if (isNotFound) {
    return (
      <section className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm font-semibold text-primary">Erreur 404</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#202124]">
          Cet artisan n&apos;existe pas
        </h1>
        <p className="mt-3 text-slate-500">
          Le profil demandé est introuvable ou n&apos;est pas public.
        </p>
        <Button asChild className="mt-7 rounded-none" variant="outline">
          <Link to="/artisans">
            <ArrowLeftIcon />
            Retour aux artisans
          </Link>
        </Button>
      </section>
    )
  }

  if (error || !artisan) {
    return (
      <section className="mx-auto max-w-2xl rounded-none bg-red-50 p-10 text-center">
        <h1 className="font-display text-2xl font-bold text-secondary">
          Impossible de charger ce profil
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {error?.message ?? 'Une erreur inattendue est survenue.'}
        </p>
        <Button className="mt-6 rounded-none" onClick={retry}>
          <ReloadIcon />
          Réessayer
        </Button>
      </section>
    )
  }

  const dateValidation = formatDate(artisan.dateValidation)
  const localisation = [artisan.quartier, artisan.ville]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="pb-28 lg:pb-8">
      <Button asChild className="mb-6 rounded-none" variant="ghost">
        <Link to="/artisans">
          <ArrowLeftIcon />
          Tous les artisans
        </Link>
      </Button>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-6">
          <Card className="overflow-hidden rounded-[18px] border-0 bg-white shadow-none">
            <div className="relative flex min-h-72 items-center justify-center bg-[#e8ce95] p-7 sm:min-h-96 sm:p-10">
              <span className="absolute left-7 top-6 text-xs font-bold uppercase tracking-[0.2em] text-black/55">
                Profil artisan
              </span>
              <Avatar className="h-36 w-36 rotate-[-3deg] rounded-none border-0 bg-white/35 shadow-none sm:h-48 sm:w-48">
                {artisan.photoProfilUrl ? (
                  <AvatarImage
                    alt={`Portrait de ${artisan.nomAffichage}`}
                    className="rounded-none object-cover"
                    src={artisan.photoProfilUrl}
                  />
                ) : null}
                <AvatarFallback className="rounded-none bg-white/35 font-display text-5xl font-extrabold tracking-[-0.06em] text-[#171717]">
                  {getInitiales(artisan.nomAffichage)}
                </AvatarFallback>
              </Avatar>
            </div>

            <CardContent className="p-7 sm:p-10">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-4xl font-extrabold tracking-[-0.055em] text-[#171717] sm:text-5xl">
                      {artisan.nomAffichage}
                    </h1>
                    {artisan.verifie ? (
                      <Badge className="rounded-none border-0 bg-primary-light px-3 py-1 text-primary shadow-none hover:bg-primary-light">
                        <CheckIcon className="mr-1.5 h-4 w-4" />
                        Vérifié par Briko
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-slate-500">{localisation}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-none bg-[#fff5df] px-4 py-2">
                  <StarFilledIcon className="h-5 w-5 text-accent" />
                  <span className="font-display text-lg font-bold text-secondary">
                    {artisan.noteMoyenne.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({artisan.nombreAvis} avis)
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {artisan.categories.map((categorie) => (
                  <Badge
                    className="rounded-none border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700"
                    key={categorie}
                    variant="outline"
                  >
                    {categorie}
                  </Badge>
                ))}
              </div>

              <Separator className="my-8" />

              <section>
                <h2 className="font-display text-xl font-bold text-[#202124]">
                  À propos
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  {artisan.description ?? 'Aucune description renseignée.'}
                </p>
              </section>
            </CardContent>
          </Card>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-none bg-[#cec8ff] p-7">
              <p className="text-sm font-semibold text-primary">Expérience</p>
              <p className="mt-2 font-display text-2xl font-bold text-[#202124]">
                {artisan.anneesExperience === null
                  ? 'Non renseignée'
                  : `${artisan.anneesExperience} ${artisan.anneesExperience === 1 ? 'an' : 'ans'}`}
              </p>
              {dateValidation ? (
                <p className="mt-2 text-sm text-slate-500">
                  Profil validé en {dateValidation}
                </p>
              ) : null}
            </div>
            <div className="rounded-none bg-[#bfe4d2] p-7">
              <p className="text-sm font-semibold text-amber-700">
                Zone d&apos;intervention
              </p>
              <p className="mt-2 font-display text-xl font-bold leading-snug text-[#202124]">
                {artisan.zoneIntervention ?? localisation}
              </p>
            </div>
          </section>
        </main>

        <aside className="lg:sticky lg:top-24">
          <Card className="rounded-[18px] border-0 bg-[#171717] text-white shadow-none">
            <CardContent className="p-6 sm:p-7">
              <p className="text-sm font-semibold text-primary">Contact direct</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em] text-white">
                Parlez de votre projet
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Appelez ou démarrez une conversation WhatsApp avec{' '}
                {artisan.nomAffichage}.
              </p>
              <p className="my-6 rounded-none bg-white/10 px-4 py-3 text-center font-semibold text-white">
                {formatTelephone(artisan.telephone)}
              </p>
              <ContactActions artisan={artisan} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
