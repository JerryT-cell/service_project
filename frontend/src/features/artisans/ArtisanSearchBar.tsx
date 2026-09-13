/**
 * La barre charge seulement les catégories de référence dans un useEffect.
 * Elle ne recherche pas les artisans elle-même : elle transmet les critères à
 * la page par onSearch, ce qui garde une seule source de vérité pour la liste.
 */
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { type FormEvent, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getCategories } from './api'
import type { ArtisanSearchParams, Categorie } from './types'

const TOUTES_LES_CATEGORIES = 'toutes'

interface ArtisanSearchBarProps {
  onSearch: (params: ArtisanSearchParams) => void
}

export function ArtisanSearchBar({ onSearch }: ArtisanSearchBarProps) {
  const [ville, setVille] = useState('Douala')
  const [categorie, setCategorie] = useState(TOUTES_LES_CATEGORIES)
  const [categories, setCategories] = useState<Categorie[]>([])
  const [categoriesError, setCategoriesError] = useState(false)

  useEffect(() => {
    let actif = true

    async function chargerCategories() {
      try {
        const resultat = await getCategories()

        if (actif) {
          setCategories(resultat)
          setCategoriesError(false)
        }
      } catch {
        if (actif) {
          setCategoriesError(true)
        }
      }
    }

    void chargerCategories()

    return () => {
      actif = false
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const villeNormalisee = ville.trim()

    onSearch({
      ville: villeNormalisee || undefined,
      categorie:
        categorie === TOUTES_LES_CATEGORIES ? undefined : categorie,
    })
  }

  return (
    <form
      className="bg-[#171717] p-3 shadow-none"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0 bg-white px-5 py-2.5">
          <label
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
            htmlFor="ville-artisan"
          >
            Ville
          </label>
          <Input
            className="mt-1 h-9 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            id="ville-artisan"
            onChange={(event) => setVille(event.target.value)}
            placeholder="Douala"
            value={ville}
          />
        </div>

        <div className="min-w-0 bg-white px-5 py-2.5">
          <label
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
            id="categorie-artisan-label"
          >
            Métier
          </label>
          <Select onValueChange={setCategorie} value={categorie}>
            <SelectTrigger
              aria-labelledby="categorie-artisan-label"
              className="mt-1 h-9 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus:ring-0"
            >
              <SelectValue placeholder="Tous les métiers" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200 p-1 shadow-xl">
              <SelectItem className="rounded-none py-2.5" value={TOUTES_LES_CATEGORIES}>
                Tous les métiers
              </SelectItem>
              {categories.map((item) => (
                <SelectItem
                  className="rounded-none py-2.5"
                  key={item.id}
                  value={item.slug}
                >
                  {item.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-[66px] rounded-none px-8 text-base shadow-none"
          type="submit"
        >
          <MagnifyingGlassIcon />
          Rechercher
        </Button>
      </div>

      {categoriesError ? (
        <p className="px-4 pb-2 pt-3 text-sm text-red-300" role="status">
          Les métiers sont momentanément indisponibles. La recherche par ville
          reste accessible.
        </p>
      ) : null}
    </form>
  )
}
