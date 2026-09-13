/**
 * Page d’inscription des clients. Elle prépare un compte `CLIENT`, valide les
 * données localement puis confie l’inscription et la session à `useAuth`.
 */
import { useState, type FormEvent } from 'react'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApiClientError } from '@/lib/apiClient'

import { useAuth } from './useAuth'

const TELEPHONE_CAMEROUNAIS = /^\+237\d{9}$/

interface RegisterErrors {
  nom?: string
  telephone?: string
  email?: string
  motDePasse?: string
  confirmation?: string
  general?: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('+237')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prochainsErrors: RegisterErrors = {}

    if (!nom.trim()) {
      prochainsErrors.nom = 'Le nom est obligatoire.'
    }

    if (!TELEPHONE_CAMEROUNAIS.test(telephone)) {
      prochainsErrors.telephone =
        'Saisissez +237 suivi des 9 chiffres du numéro.'
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      prochainsErrors.email = 'Saisissez une adresse email valide.'
    }

    if (motDePasse.length < 8) {
      prochainsErrors.motDePasse =
        'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (confirmation !== motDePasse) {
      prochainsErrors.confirmation = 'Les mots de passe ne correspondent pas.'
    }

    if (Object.keys(prochainsErrors).length > 0) {
      setErrors(prochainsErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await register({
        nom: nom.trim(),
        telephone,
        email: email.trim() || undefined,
        motDePasse,
        role: 'CLIENT',
      })
      navigate('/')
    } catch (error) {
      setErrors({
        general:
          error instanceof ApiClientError
            ? error.message
            : 'Inscription impossible pour le moment. Réessayez plus tard.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid overflow-hidden rounded-none border border-slate-200 bg-surface lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="m-3 hidden min-h-[620px] flex-col justify-between rounded-none bg-[#fff5df] p-10 lg:flex">
        <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white text-primary">
          <CheckCircledIcon className="h-7 w-7" />
        </div>
        <div>
          <p className="font-display text-4xl font-bold leading-tight tracking-tight text-[#202124]">
            Votre projet.
            <br />
            Les bonnes mains.
          </p>
          <p className="mt-5 max-w-sm leading-7 text-slate-600">
            Créez votre espace pour retrouver facilement les professionnels qui
            vous inspirent confiance.
          </p>
        </div>
      </aside>

      <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
        <p className="text-sm font-semibold text-primary">Bienvenue chez Briko</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.035em] text-[#202124] sm:text-5xl">
          Créer un compte
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Quelques informations suffisent pour commencer.
        </p>

        <form className="mt-8 space-y-4" noValidate onSubmit={handleSubmit}>
          {errors.general && (
            <div
              className="rounded-none bg-red-50 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="nom">
                Nom complet
              </label>
              <Input
                aria-invalid={Boolean(errors.nom)}
                autoComplete="name"
                className="h-12 rounded-none px-4 text-base shadow-none"
                id="nom"
                onChange={(event) => setNom(event.target.value)}
                value={nom}
              />
              {errors.nom && <p className="mt-2 text-sm text-danger">{errors.nom}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="register-telephone">
                Téléphone
              </label>
              <Input
                aria-invalid={Boolean(errors.telephone)}
                autoComplete="tel"
                className="h-12 rounded-none px-4 text-base shadow-none"
                id="register-telephone"
                inputMode="tel"
                onChange={(event) => setTelephone(event.target.value)}
                value={telephone}
              />
              {errors.telephone && (
                <p className="mt-2 text-sm text-danger">{errors.telephone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="email">
              Email <span className="font-normal text-slate-400">(optionnel)</span>
            </label>
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className="h-12 rounded-none px-4 text-base shadow-none"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
            {errors.email && <p className="mt-2 text-sm text-danger">{errors.email}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="register-password">
                Mot de passe
              </label>
              <Input
                aria-invalid={Boolean(errors.motDePasse)}
                autoComplete="new-password"
                className="h-12 rounded-none px-4 text-base shadow-none"
                id="register-password"
                onChange={(event) => setMotDePasse(event.target.value)}
                type="password"
                value={motDePasse}
              />
              {errors.motDePasse && (
                <p className="mt-2 text-sm text-danger">{errors.motDePasse}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="confirmation">
                Confirmation
              </label>
              <Input
                aria-invalid={Boolean(errors.confirmation)}
                autoComplete="new-password"
                className="h-12 rounded-none px-4 text-base shadow-none"
                id="confirmation"
                onChange={(event) => setConfirmation(event.target.value)}
                type="password"
                value={confirmation}
              />
              {errors.confirmation && (
                <p className="mt-2 text-sm text-danger">{errors.confirmation}</p>
              )}
            </div>
          </div>

          <Button
            className="mt-2 h-12 w-full rounded-none text-base shadow-none hover:bg-primary-dark"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Création…' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Déjà inscrit ?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/connexion">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  )
}
