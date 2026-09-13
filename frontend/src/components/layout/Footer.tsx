/**
 * Pied de page commun et volontairement sobre. Les liens additionnels seront
 * ajoutés seulement lorsqu’une fonctionnalité réelle les nécessitera.
 */
export function Footer() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="font-display text-6xl font-semibold tracking-[-0.075em] sm:text-8xl">
          bri<span className="text-primary">ko</span>
        </p>
        <p className="mt-8 border-t border-white/15 pt-5 text-sm text-white/55">
          © 2026 Briko — Plateforme BTP de confiance au Cameroun
        </p>
      </div>
    </footer>
  )
}
