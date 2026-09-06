# Contrat d'API Briko — Phase 0

Ce document décrit l'API effectivement disponible à la fin de la phase 0. Il
peut servir directement à créer les mocks du frontend.

## Conventions générales

- URL locale : `http://localhost:8080`
- Les requêtes et réponses utilisent `application/json`.
- Tous les endpoints décrits ici sont publics et ne demandent pas de JWT.
- Les noms de propriétés JSON sont sensibles à la casse.
- Les dates suivent ISO 8601, par exemple `2026-09-06T14:38:24.504927Z`.
- Une valeur absente en base peut être renvoyée sous la forme `null`.
- Les nombres décimaux, comme `noteMoyenne`, sont des nombres JSON et non des
  chaînes de caractères.

## Format d'erreur commun

Toutes les erreurs applicatives utilisent cette structure :

```json
{
  "timestamp": "2026-09-06T15:12:32.059089Z",
  "status": 404,
  "erreur": "Not Found",
  "message": "Artisan introuvable.",
  "chemin": "/api/artisans/5"
}
```

Pour une erreur de validation `400`, la propriété `champs` indique les champs
invalides. Elle est absente des autres erreurs :

```json
{
  "timestamp": "2026-09-06T14:45:12.400Z",
  "status": 400,
  "erreur": "Bad Request",
  "message": "Un ou plusieurs champs sont invalides.",
  "chemin": "/api/auth/register",
  "champs": {
    "telephone": "Le téléphone doit commencer par +237 et contenir 9 chiffres.",
    "motDePasse": "Le mot de passe doit contenir au moins 8 caractères."
  }
}
```

Une erreur interne non prévue renvoie `500 Internal Server Error` avec le
message générique `Une erreur interne est survenue.`.

## Inscrire un utilisateur

`POST /api/auth/register`

Crée un compte `CLIENT` ou `PRESTATAIRE` et ouvre immédiatement une session en
renvoyant un JWT. Le rôle `ADMIN` ne peut pas être obtenu par cette route.

### Corps de requête

| Propriété | Type | Obligatoire | Contraintes |
| --- | --- | --- | --- |
| `nom` | string | oui | Non vide, 120 caractères maximum |
| `telephone` | string | oui | Format `+237` suivi exactement de 9 chiffres |
| `email` | string ou null | non | Adresse valide, 180 caractères maximum |
| `motDePasse` | string | oui | 8 caractères minimum |
| `role` | string | oui | `CLIENT` ou `PRESTATAIRE` |

Exemple de requête :

```json
{
  "nom": "Nadine Tchoumi",
  "telephone": "+237699123456",
  "email": "nadine@example.cm",
  "motDePasse": "briko5678",
  "role": "CLIENT"
}
```

### Réponse réussie

Statut : `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrMjM3Njk5MTIzNDU2IiwiaWQiOjgsInJvbGUiOiJDTElFTlQifQ.signature",
  "id": 8,
  "nom": "Nadine Tchoumi",
  "role": "CLIENT"
}
```

Le token montré dans la documentation est abrégé : le backend renvoie un JWT
signé complet. Il doit être stocké côté client pour les futures routes
protégées et envoyé sous la forme `Authorization: Bearer <token>`.

### Erreurs possibles

| Statut | Cas |
| --- | --- |
| `400 Bad Request` | Champ obligatoire absent, format ou taille invalide |
| `409 Conflict` | Téléphone déjà utilisé ou tentative d'inscription avec le rôle `ADMIN` |
| `500 Internal Server Error` | Erreur interne non prévue |

## Connecter un utilisateur

`POST /api/auth/login`

Authentifie un compte actif par téléphone et mot de passe, puis renvoie un JWT.

### Corps de requête

| Propriété | Type | Obligatoire | Contraintes |
| --- | --- | --- | --- |
| `telephone` | string | oui | Format `+237` suivi exactement de 9 chiffres |
| `motDePasse` | string | oui | Non vide |

Exemple avec le compte administrateur de démonstration :

```json
{
  "telephone": "+237600000001",
  "motDePasse": "briko1234"
}
```

### Réponse réussie

Statut : `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrMjM3NjAwMDAwMDAxIiwiaWQiOjEsInJvbGUiOiJBRE1JTiJ9.signature",
  "id": 1,
  "nom": "Admin Briko",
  "role": "ADMIN"
}
```

Le token est abrégé dans cet exemple, comme pour l'inscription.

### Erreurs possibles

| Statut | Cas |
| --- | --- |
| `400 Bad Request` | Téléphone mal formé ou champ vide |
| `401 Unauthorized` | Téléphone inconnu, compte inactif ou mot de passe incorrect |
| `500 Internal Server Error` | Erreur interne non prévue |

Pour ne pas révéler si un compte existe, tous les échecs d'authentification
renvoient le même message : `Téléphone ou mot de passe incorrect.`.

## Lister les catégories

`GET /api/categories`

Retourne les catégories actives, triées par leur ordre d'affichage.

### Paramètres et corps

Aucun paramètre et aucun corps de requête.

### Réponse réussie

Statut : `200 OK`

```json
[
  {
    "id": 1,
    "nom": "Plombier",
    "slug": "plombier",
    "description": "Installation et réparation de plomberie sanitaire",
    "icone": null
  },
  {
    "id": 2,
    "nom": "Électricien",
    "slug": "electricien",
    "description": "Installation électrique, dépannage, mise aux normes",
    "icone": null
  },
  {
    "id": 3,
    "nom": "Maçon",
    "slug": "macon",
    "description": "Construction, dalles, murs, fondations",
    "icone": null
  },
  {
    "id": 4,
    "nom": "Peintre",
    "slug": "peintre",
    "description": "Peinture intérieure et extérieure, enduits",
    "icone": null
  },
  {
    "id": 5,
    "nom": "Menuisier",
    "slug": "menuisier",
    "description": "Portes, fenêtres, meubles sur mesure",
    "icone": null
  },
  {
    "id": 6,
    "nom": "Carreleur",
    "slug": "carreleur",
    "description": "Pose de carrelage sol et mur",
    "icone": null
  },
  {
    "id": 7,
    "nom": "Vitrier",
    "slug": "vitrier",
    "description": "Pose et remplacement de vitrages",
    "icone": null
  },
  {
    "id": 8,
    "nom": "Soudeur",
    "slug": "soudeur",
    "description": "Ferronnerie, portails, grilles",
    "icone": null
  },
  {
    "id": 9,
    "nom": "Frigoriste",
    "slug": "frigoriste",
    "description": "Climatisation et froid",
    "icone": null
  }
]
```

### Erreurs possibles

| Statut | Cas |
| --- | --- |
| `500 Internal Server Error` | Erreur interne non prévue |

## Rechercher des artisans

`GET /api/artisans`

Retourne exclusivement les artisans au statut `VALIDE`, triés par
`nomAffichage`. Les deux filtres sont facultatifs et cumulables. Sans filtre,
la route retourne tous les artisans publiquement visibles. Aucun résultat est
une réponse normale : `200 OK` avec `[]`.

### Paramètres de requête

| Paramètre | Type | Obligatoire | Effet |
| --- | --- | --- | --- |
| `ville` | string | non | Ville exacte, sans tenir compte des majuscules/minuscules |
| `categorie` | string | non | Slug exact d'une catégorie, par exemple `plombier` |

Exemple :

`GET /api/artisans?ville=Douala&categorie=plombier`

### Corps de requête

Aucun.

### Réponse réussie

Statut : `200 OK`

```json
[
  {
    "id": 1,
    "nomAffichage": "Jean Nkongo",
    "ville": "Douala",
    "quartier": "Akwa",
    "categories": [
      "Plombier"
    ],
    "noteMoyenne": 4.70,
    "nombreAvis": 0,
    "photoProfilUrl": null,
    "verifie": true
  }
]
```

Le téléphone est volontairement absent de cette réponse de liste.

### Erreurs possibles

| Statut | Cas |
| --- | --- |
| `500 Internal Server Error` | Erreur interne non prévue |

## Consulter un artisan

`GET /api/artisans/{id}`

Retourne la fiche détaillée d'un artisan uniquement si son statut est
`VALIDE`. Un profil existant mais non validé est traité exactement comme un
identifiant absent afin de ne jamais révéler un profil interne.

### Paramètre de chemin

| Paramètre | Type | Obligatoire | Exemple |
| --- | --- | --- | --- |
| `id` | entier 64 bits | oui | `1` |

### Corps de requête

Aucun.

### Réponse réussie

Statut : `200 OK`

Exemple : `GET /api/artisans/1`

```json
{
  "id": 1,
  "nomAffichage": "Jean Nkongo",
  "ville": "Douala",
  "quartier": "Akwa",
  "categories": [
    "Plombier"
  ],
  "noteMoyenne": 4.70,
  "nombreAvis": 0,
  "photoProfilUrl": null,
  "verifie": true,
  "description": "Plombier depuis 12 ans, spécialisé en installation sanitaire et réparation de fuites. Intervention rapide.",
  "zoneIntervention": "Akwa, Bonanjo, Deïdo",
  "anneesExperience": 12,
  "telephone": "+237690000101",
  "dateValidation": "2026-09-06T14:38:24.504927Z"
}
```

Le téléphone est exposé uniquement dans cette réponse de détail.

### Erreurs possibles

| Statut | Cas |
| --- | --- |
| `404 Not Found` | Identifiant absent ou profil non validé |
| `500 Internal Server Error` | Identifiant non numérique ou erreur interne non prévue |

Exemple de `404` pour le profil de démonstration encore en attente :

```json
{
  "timestamp": "2026-09-06T15:12:32.059089Z",
  "status": 404,
  "erreur": "Not Found",
  "message": "Artisan introuvable.",
  "chemin": "/api/artisans/5"
}
```
