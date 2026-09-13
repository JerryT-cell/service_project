/**
 * Page de connexion client. Elle valide les champs, délègue la session à
 * `useAuth` et ne contient aucun appel HTTP direct.
 */
import { useState, type FormEvent } from 'react'
import { ArrowRightIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApiClientError } from '@/lib/apiClient'

import { useAuth } from './useAuth'

const TELEPHONE_CAMEROUNAIS = /^\+237\d{9}$/

interface LoginErrors {
  telephone?: string
  motDePasse?: string
  general?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [telephone, setTelephone] = useState('+237')
  const [motDePasse, setMotDePasse] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prochainsErrors: LoginErrors = {}

    if (!TELEPHONE_CAMEROUNAIS.test(telephone)) {
      prochainsErrors.telephone =
        'Saisissez +237 suivi des 9 chiffres du numéro.'
    }

    if (!motDePasse) {
      prochainsErrors.motDePasse = 'Le mot de passe est obligatoire.'
    }

    if (Object.keys(prochainsErrors).length > 0) {
      setErrors(prochainsErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await login({ telephone, motDePasse })
      navigate('/')
    } catch (error) {
      setErrors({
        general:
          error instanceof ApiClientError
            ? error.message
            : 'Connexion impossible pour le moment. Réessayez plus tard.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid overflow-hidden rounded-none border border-slate-200 bg-surface lg:grid-cols-[1fr_0.9fr]">
      <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-20">
        <p className="text-sm font-semibold text-primary">Heureux de vous revoir</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.035em] text-[#202124] sm:text-5xl">
          Connexion
        </h1>
        <p className="mt-4 max-w-md leading-7 text-slate-600">
          Retrouvez vos artisans et poursuivez vos projets en toute confiance.
        </p>

        <form className="mt-9 max-w-md space-y-5" noValidate onSubmit={handleSubmit}>
          {errors.general && (
            <div
              className="rounded-none bg-red-50 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="telephone">
              Téléphone
            </label>
            <Input
              aria-describedby={errors.telephone ? 'telephone-error' : undefined}
              aria-invalid={Boolean(errors.telephone)}
              autoComplete="tel"
              className="h-12 rounded-none bg-white px-4 text-base shadow-none"
              id="telephone"
              inputMode="tel"
              onChange={(event) => setTelephone(event.target.value)}
              placeholder="+237 6XX XXX XXX"
              value={telephone}
            />
            {errors.telephone && (
              <p className="mt-2 text-sm text-danger" id="telephone-error">
                {errors.telephone}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="motDePasse">
              Mot de passe
            </label>
            <Input
              aria-describedby={errors.motDePasse ? 'mot-de-passe-error' : undefined}
              aria-invalid={Boolean(errors.motDePasse)}
              autoComplete="current-password"
              className="h-12 rounded-none bg-white px-4 text-base shadow-none"
              id="motDePasse"
              onChange={(event) => setMotDePasse(event.target.value)}
              type="password"
              value={motDePasse}
            />
            {errors.motDePasse && (
              <p className="mt-2 text-sm text-danger" id="mot-de-passe-error">
                {errors.motDePasse}
              </p>
            )}
          </div>

          <Button
            className="h-12 w-full rounded-none text-base shadow-none hover:bg-primary-dark"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
            {!isSubmitting && <ArrowRightIcon className="ml-1" />}
          </Button>
        </form>

        <p className="mt-7 text-sm text-slate-600">
          Pas encore de compte ?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/inscription">
            Créer un compte
          </Link>
        </p>
      </div>

      <aside className="m-3 flex min-h-[420px] flex-col justify-between rounded-none bg-[#edf7f2] p-8 sm:m-5 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white text-primary">
          <CheckCircledIcon className="h-7 w-7" />
        </div>
        <div>
          <p className="font-display text-3xl font-bold leading-tight tracking-tight text-[#202124] sm:text-4xl">
            Moins de doute.
            <br />
            Plus de confiance.
          </p>
          <p className="mt-5 max-w-sm leading-7 text-slate-600">
            Chaque professionnel visible sur Briko a été rencontré et vérifié
            par notre équipe à Douala.
          </p>
        </div>
      </aside>
    </section>
  )
}
