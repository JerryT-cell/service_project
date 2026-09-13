/**
 * Utilitaires génériques partagés par plusieurs fonctionnalités. Ce fichier
 * contient uniquement des fonctions sans état et sans appel au backend.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un numéro camerounais sur neuf chiffres pour faciliter sa lecture.
 * Une valeur incomplète ou étrangère est rendue telle quelle.
 */
export function formatTelephone(telephone: string): string {
  const valeurOriginale = telephone.trim()
  const chiffres = valeurOriginale.replace(/\D/g, '')

  let numeroNational = chiffres

  if (chiffres.startsWith('00237')) {
    numeroNational = chiffres.slice(5)
  } else if (chiffres.startsWith('237')) {
    numeroNational = chiffres.slice(3)
  }

  if (numeroNational.length !== 9) {
    return valeurOriginale
  }

  return `+237 ${numeroNational.slice(0, 1)} ${numeroNational.slice(1, 3)} ${numeroNational.slice(3, 5)} ${numeroNational.slice(5, 7)} ${numeroNational.slice(7, 9)}`
}
