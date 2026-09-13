# Briko

Briko est une plateforme de mise en relation entre des clients et des artisans
du BTP au Cameroun, avec un premier lancement à Douala. La confiance est au
cœur du produit : un prestataire inscrit reste invisible du public jusqu'à sa
validation manuelle par l'équipe Briko.

Le dépôt contient actuellement le socle backend de la phase 0. Le frontend sera
ajouté plus tard dans un dossier dédié.

## État du projet

- Authentification par JWT : inscription et connexion
- Rôles `CLIENT`, `PRESTATAIRE` et `ADMIN`
- Catalogue public des métiers BTP
- Recherche publique des artisans par ville et catégorie
- Fiche détaillée d'un artisan validé
- Filtrage systématique des profils non validés
- Schéma PostgreSQL versionné avec Flyway

## Technologies

- Java 25
- Spring Boot 4.1.1
- Spring Security et JWT
- Spring Data JPA et Hibernate
- PostgreSQL 16
- Flyway
- Maven Wrapper
- Docker Compose

## Organisation du dépôt

```text
briko/
├── backend/                 API Spring Boot
│   ├── db/migration/        migrations Flyway
│   ├── docs/                contrat d'API
│   └── src/                 code Java et tests
├── frontend/                prévu, pas encore créé
├── docker-compose.yml       PostgreSQL local
├── .env.example             configuration locale de référence
└── README.md
```

Les principaux domaines Java se trouvent sous
`backend/src/main/java/com/briko` :

- `auth` : inscription et connexion
- `utilisateur` : comptes et rôles
- `categorie` : métiers BTP
- `artisan` : recherche et profils publics
- `common` : configuration, sécurité et gestion des erreurs

Le [diagramme de classes du backend](backend/docs/backend-class-diagram.md)
présente les dépendances entre contrôleurs, services, repositories, entités,
DTO et composants de sécurité.

Le [guide d'authentification](backend/src/main/java/com/briko/auth/README.md)
explique les workflows d'inscription, de connexion et de validation JWT ainsi
que le rôle de BCrypt.

Une [version contenant uniquement le diagramme UML](backend/docs/backend-class-diagram.puml)
est également disponible pour un affichage direct.

## Prérequis

- JDK 25
- Docker avec Docker Compose

Le projet utilise son propre Maven Wrapper : aucune installation globale de
Maven n'est nécessaire.

Vérifier Java :

```bash
java -version
```

## Démarrage local

Depuis la racine du dépôt, créer la configuration locale et démarrer
PostgreSQL :

```bash
cp .env.example .env
docker compose up -d
```

Lancer ensuite le backend :

```bash
cd backend
set -a
source ../.env
set +a
./mvnw spring-boot:run
```

L'API est alors disponible sur `http://localhost:8080`.

Test rapide :

```bash
curl http://localhost:8080/api/categories
```

Pour arrêter l'application, utiliser `Ctrl+C`. Depuis la racine du dépôt,
arrêter PostgreSQL avec :

```bash
docker compose stop
```

Cette commande conserve le volume et les données PostgreSQL.

## Configuration

Les valeurs locales se trouvent dans `.env`, créé à partir de `.env.example`.
Le fichier `.env` est ignoré par Git et ne doit pas être commité.

| Variable | Valeur locale par défaut | Description |
| --- | --- | --- |
| `DB_HOST` | `localhost` | Hôte PostgreSQL vu par Spring Boot |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_NAME` | `briko` | Nom de la base |
| `DB_USERNAME` | `briko` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `briko` | Mot de passe PostgreSQL |
| `SERVER_PORT` | `8080` | Port HTTP du backend |
| `JWT_SECRET` | secret de développement | Clé de signature des JWT |
| `JWT_EXPIRATION_MS` | `86400000` | Durée du token, soit 24 heures |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Origine autorisée du futur frontend |

Le secret JWT fourni est réservé au développement. Il doit être remplacé par
une valeur longue et confidentielle dans tout autre environnement.

Docker Compose charge `.env` automatiquement. Les commandes `set -a` et
`source ../.env` du démarrage local exportent les mêmes valeurs pour Spring
Boot.

## Endpoints disponibles

| Méthode | Chemin | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Créer un compte client ou prestataire |
| `POST` | `/api/auth/login` | Se connecter et recevoir un JWT |
| `GET` | `/api/categories` | Lister les catégories actives |
| `GET` | `/api/artisans` | Rechercher les artisans validés |
| `GET` | `/api/artisans/{id}` | Consulter un artisan validé |

La recherche accepte les filtres facultatifs `ville` et `categorie` :

```text
GET /api/artisans?ville=Douala&categorie=plombier
```

Le contrat complet, avec les corps JSON, les réponses et les erreurs, se trouve
dans [`backend/docs/api-contract.md`](backend/docs/api-contract.md).

## Comptes de démonstration

Le mot de passe de tous les comptes de démonstration est `briko1234`.

| Rôle | Téléphone | Usage |
| --- | --- | --- |
| `ADMIN` | `+237600000001` | Administration de démonstration |
| `PRESTATAIRE` | `+237690000101` | Profil artisan validé de Jean Nkongo |
| `CLIENT` | `+237670000201` | Parcours client de démonstration |

Ces identifiants sont strictement réservés au développement.

## Base de données et migrations

Flyway exécute au démarrage les scripts présents dans
`backend/db/migration`. Hibernate utilise `ddl-auto: validate` : il vérifie que
les entités correspondent au schéma sans créer ni modifier les tables.

Une migration déjà appliquée ne doit jamais être modifiée. Toute évolution du
schéma doit être ajoutée dans un nouveau fichier versionné, par exemple
`V4__description_du_changement.sql`.

## Tests

Les tests actuels chargent le contexte complet et nécessitent PostgreSQL :

```bash
docker compose up -d
cd backend
set -a
source ../.env
set +a
./mvnw test
```

## Frontend à venir

Le frontend n'est pas encore présent. Il pourra être ajouté sous `frontend/`
sans déplacer le backend. La configuration CORS autorise déjà par défaut
`http://localhost:5173`, port habituel d'un serveur de développement Vite.
