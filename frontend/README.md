# Briko — Frontend phase 0

Ce frontend est le socle pédagogique de Briko. Son objectif n’est pas encore de
couvrir toute la roadmap : il montre une architecture React simple que l’équipe
peut comprendre, tester, puis reproduire fonctionnalité par fonctionnalité.

## Démarrer le projet

Prérequis : Node.js 24 et un backend Briko accessible sur le port `8080`.

```bash
cp .env.example .env
npm install
npm run dev
```

L’application est ensuite disponible sur `http://localhost:5173`.

Avant de livrer une modification :

```bash
npm run lint
npm run build
```

## Ordre conseillé pour lire le code

Le dossier `features/artisans` est le modèle de référence de la phase 0 :

1. `types.ts` décrit exactement les données reçues du backend.
2. `api.ts` connaît les endpoints HTTP de la fonctionnalité.
3. `useArtisans.ts` et `useArtisan.ts` orchestrent chargement et erreurs.
4. `ArtisanCard.tsx` affiche des données sans effectuer d’appel réseau.
5. `ArtisansPage.tsx` assemble les composants et les différents états.

Le trajet d’une recherche reste toujours visible :

```text
Page → Hook → API de la fonctionnalité → apiClient → Backend Spring
```

## Rôle des dossiers

```text
src/
├── components/ui       composants visuels réutilisables
├── components/layout   structure commune des pages
├── features            code regroupé par fonctionnalité métier
├── lib                 outils globaux, dont le client HTTP
└── types               contrats réellement partagés
```

Une fonctionnalité garde ses types, appels API, hooks et composants dans son
propre dossier. Elle ne dépend pas des détails internes d’une autre feature.

## Règles pédagogiques du socle

- Aucun `fetch` en dehors de `src/lib/apiClient.ts`.
- Les types frontend doivent rester alignés avec les DTO Java.
- Une page coordonne ; elle ne contient pas d’accès réseau direct.
- Un composant d’affichage reçoit ses données par props.
- Les états chargement, erreur et résultat vide sont toujours visibles.
- Le design par défaut est carré dans les composants `ui`. Les deux arrondis de
  la fiche artisan sont écrits explicitement dans la page : aucune règle CSS
  globale cachée ne modifie les composants.
- Switzer est la police globale ; sa configuration se trouve dans
  `tailwind.config.ts` et `src/index.css`.

## Ajouter une future fonctionnalité

Pour créer par exemple `features/avis`, reprendre le même ordre : types → API →
hook → composant → page. Éviter de généraliser du code tant qu’au moins deux
fonctionnalités n’ont pas démontré exactement le même besoin.

La spécification complète de la phase reste la source de vérité :
`briko-instructions-frontend-phase0.md`.
