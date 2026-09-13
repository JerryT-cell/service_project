# Authentification du backend Briko

Ce document explique l'authentification actuellement implémentée dans Briko :
inscription, connexion, génération du JWT et contrôle des requêtes protégées.

## Authentification et autorisation

Ces deux notions sont différentes :

- **Authentification** : déterminer qui fait la requête. Dans Briko,
  l'utilisateur se connecte avec son téléphone et son mot de passe.
- **Autorisation** : déterminer ce que cet utilisateur a le droit de faire.
  Briko utilise les rôles `CLIENT`, `PRESTATAIRE` et `ADMIN`.

Un utilisateur peut donc être correctement authentifié mais recevoir `403
Forbidden` s'il tente une action réservée à un autre rôle.

## Composants impliqués

| Classe | Responsabilité |
| --- | --- |
| [`AuthController`](AuthController.java) | Reçoit les requêtes d'inscription et de connexion |
| [`AuthService`](AuthService.java) | Applique les règles métier, encode les mots de passe et déclenche l'authentification |
| [`RegisterRequest`](dto/RegisterRequest.java) | Valide les données d'inscription |
| [`LoginRequest`](dto/LoginRequest.java) | Valide les identifiants de connexion |
| [`AuthResponse`](dto/AuthResponse.java) | Renvoie le JWT et l'identité minimale |
| [`UtilisateurDetailsService`](../common/security/UtilisateurDetailsService.java) | Adapte un compte Briko au format attendu par Spring Security |
| [`JwtService`](../common/security/JwtService.java) | Crée, signe, lit et valide les JWT |
| [`JwtAuthenticationFilter`](../common/security/JwtAuthenticationFilter.java) | Recherche un JWT sur chaque requête HTTP |
| [`SecurityConfig`](../common/security/SecurityConfig.java) | Définit les routes publiques, protégées et réservées aux administrateurs |
| [`UtilisateurRepository`](../utilisateur/UtilisateurRepository.java) | Recherche les comptes dans PostgreSQL |
| [`GlobalExceptionHandler`](../common/exception/GlobalExceptionHandler.java) | Transforme les erreurs en réponses JSON cohérentes |

## Workflow 1 — Inscription

Endpoint : `POST /api/auth/register`

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AuthController
    participant Service as AuthService
    participant Repository as UtilisateurRepository
    participant BCrypt as PasswordEncoder BCrypt
    participant DB as PostgreSQL
    participant JWT as JwtService

    Client->>Controller: POST /api/auth/register + JSON
    Controller->>Controller: Validation de RegisterRequest
    Controller->>Service: register(request)
    Service->>Repository: existsByTelephone(telephone)
    Repository->>DB: Recherche du téléphone
    DB-->>Repository: true ou false
    Service->>Service: Refus du rôle ADMIN
    Service->>BCrypt: encode(motDePasse)
    BCrypt-->>Service: hash BCrypt
    Service->>Repository: save(utilisateur)
    Repository->>DB: INSERT utilisateur
    DB-->>Repository: utilisateur enregistré
    Service->>JWT: generateToken(utilisateur)
    JWT-->>Service: JWT signé
    Service-->>Controller: AuthResponse
    Controller-->>Client: 201 Created + JSON
```

### Étapes importantes

1. `AuthController.register` reçoit un `RegisterRequest` annoté avec `@Valid`.
2. Jakarta Validation vérifie notamment :
   - nom obligatoire, 120 caractères maximum ;
   - téléphone au format `+237` suivi de neuf chiffres ;
   - email facultatif mais valide lorsqu'il est fourni ;
   - mot de passe d'au moins huit caractères ;
   - rôle obligatoire.
3. `AuthService.register` vérifie que le téléphone n'est pas déjà utilisé.
4. Le rôle `ADMIN` est refusé. Un administrateur ne doit jamais pouvoir créer
   son compte depuis l'inscription publique.
5. `PasswordEncoder.encode` transforme le mot de passe en hash BCrypt.
6. Seul le hash est enregistré dans `mot_de_passe_hash`.
7. L'utilisateur enregistré reçoit immédiatement un JWT.
8. Le controller renvoie `201 Created` avec un `AuthResponse`.

`@Transactional` garantit que l'inscription est atomique : si une erreur
survient, l'opération de base de données est annulée.

À ce stade, inscrire un compte `PRESTATAIRE` ne crée pas encore automatiquement
son profil `Artisan`. La création et la validation de ce profil appartiennent à
une étape fonctionnelle ultérieure.

## Workflow 2 — Connexion

Endpoint : `POST /api/auth/login`

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AuthController
    participant Service as AuthService
    participant Manager as AuthenticationManager
    participant Details as UtilisateurDetailsService
    participant Repository as UtilisateurRepository
    participant DB as PostgreSQL
    participant BCrypt as PasswordEncoder BCrypt
    participant JWT as JwtService

    Client->>Controller: POST /api/auth/login + identifiants
    Controller->>Controller: Validation de LoginRequest
    Controller->>Service: login(request)
    Service->>Manager: authenticate(telephone, motDePasse)
    Manager->>Details: loadUserByUsername(telephone)
    Details->>Repository: findByTelephone(telephone)
    Repository->>DB: SELECT utilisateur
    DB-->>Repository: compte + hash BCrypt
    Repository-->>Details: Utilisateur
    Details-->>Manager: UserDetails
    Manager->>BCrypt: matches(motDePasse, hash)
    BCrypt-->>Manager: true ou false
    Manager-->>Service: authentification réussie
    Service->>JWT: generateToken(utilisateur)
    JWT-->>Service: JWT signé
    Service-->>Controller: AuthResponse
    Controller-->>Client: 200 OK + JSON
```

### Ce que fait `AuthenticationManager`

`AuthService` ne compare pas lui-même les mots de passe. Il construit un
`UsernamePasswordAuthenticationToken` contenant le téléphone et le mot de
passe reçus, puis le transmet à `AuthenticationManager`.

Spring Security orchestre ensuite :

1. `UtilisateurDetailsService.loadUserByUsername` recherche le compte par
   téléphone.
2. Il transforme `Utilisateur` en `UserDetails` avec :
   - le téléphone comme username ;
   - le hash BCrypt comme password ;
   - le rôle sous la forme `ROLE_CLIENT`, `ROLE_PRESTATAIRE` ou `ROLE_ADMIN` ;
   - l'état du compte avec `disabled(!utilisateur.isActif())`.
3. Spring utilise le bean `PasswordEncoder` pour appeler BCrypt et comparer le
   mot de passe reçu au hash enregistré.
4. Si le compte est actif et le mot de passe correct, l'authentification
   réussit.
5. `AuthService` génère alors le JWT et renvoie `AuthResponse`.

Téléphone inconnu, mauvais mot de passe et compte inactif renvoient tous le
même message : `Téléphone ou mot de passe incorrect.`. Cette uniformité empêche
un attaquant de découvrir quels numéros possèdent un compte.

## Workflow 3 — Requête avec JWT

Pour une future route protégée, le frontend enverra le token dans le header :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

```mermaid
sequenceDiagram
    actor Client
    participant Filter as JwtAuthenticationFilter
    participant JWT as JwtService
    participant Details as UtilisateurDetailsService
    participant DB as PostgreSQL
    participant Context as SecurityContextHolder
    participant Security as SecurityConfig
    participant Controller

    Client->>Filter: Requête + Authorization Bearer
    Filter->>JWT: extractTelephone(token)
    JWT->>JWT: Vérifie signature et expiration
    JWT-->>Filter: téléphone
    Filter->>Details: loadUserByUsername(telephone)
    Details->>DB: Recharge le compte
    DB-->>Details: compte, rôle et état actif
    Details-->>Filter: UserDetails
    Filter->>JWT: isTokenValid(token, userDetails)
    JWT-->>Filter: true ou false
    Filter->>Context: setAuthentication(...)
    Filter->>Security: Continue la chaîne
    Security->>Security: Vérifie route et rôle
    Security->>Controller: Autorise la requête
    Controller-->>Client: Réponse HTTP
```

### Travail de `JwtAuthenticationFilter`

Le filtre hérite de `OncePerRequestFilter`, il s'exécute donc une fois pour
chaque requête :

1. Il lit le header `Authorization`.
2. Sans préfixe `Bearer `, il continue sans authentifier l'utilisateur.
3. Avec un token, il extrait le téléphone grâce à `JwtService`.
4. Il recharge toujours le compte depuis PostgreSQL.
5. Il vérifie le token, son expiration, le téléphone et l'état actif du compte.
6. Il construit un `UsernamePasswordAuthenticationToken` sans mot de passe.
7. Il place cette authentification dans `SecurityContextHolder`.
8. `SecurityConfig` décide ensuite si l'utilisateur peut accéder à la route.

Un JWT invalide n'arrête pas directement la requête : il est ignoré. Une route
publique reste accessible et une route protégée renvoie ensuite naturellement
`401 Unauthorized` puisque personne n'a été authentifié.

## Qu'est-ce qu'un JWT ?

JWT signifie **JSON Web Token**. C'est une chaîne signée permettant au client
de transporter une preuve d'authentification entre les requêtes.

Un JWT possède trois parties séparées par des points :

```text
header.payload.signature
```

Exemple simplifié :

```text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrMjM3NjAwMDAwMDAxIn0.signature
```

### Les trois parties

1. **Header** : indique notamment l'algorithme de signature.
2. **Payload** : contient les claims, c'est-à-dire les informations du token.
3. **Signature** : prouve que le backend a créé le token et que son contenu n'a
   pas été modifié.

Le payload Briko contient :

| Claim | Signification |
| --- | --- |
| `sub` | Téléphone de l'utilisateur |
| `id` | Identifiant de l'utilisateur |
| `role` | Rôle lors de la création du token |
| `iat` | Date de création |
| `exp` | Date d'expiration |

### Un JWT n'est pas chiffré

Le header et le payload sont encodés en Base64URL, mais ils peuvent être lus.
Il ne faut donc jamais mettre un mot de passe, un hash ou une donnée secrète
dans le JWT.

La signature ne cache pas le contenu : elle empêche sa modification. Si un
client transforme `CLIENT` en `ADMIN` dans le payload, la signature ne
correspond plus et le backend rejette le token.

### Création dans `JwtService`

`generateToken` :

1. définit le téléphone comme sujet ;
2. ajoute `id` et `role` ;
3. ajoute les dates de création et d'expiration ;
4. signe le token avec la clé HMAC provenant de `briko.jwt.secret` ;
5. renvoie la chaîne compacte au frontend.

L'expiration par défaut est définie par `JWT_EXPIRATION_MS=86400000`, soit 24
heures.

### Validation dans `JwtService`

`isTokenValid` vérifie :

- que la signature correspond au secret du serveur ;
- que le token n'est pas expiré ;
- que le téléphone du token correspond au compte rechargé ;
- que le compte est toujours actif.

Le rôle utilisé par Spring pour autoriser la requête vient du compte rechargé
depuis PostgreSQL, pas uniquement du claim `role`. Un changement de rôle ou une
désactivation en base est donc pris en compte sur la requête suivante.

## Qu'est-ce que BCrypt ?

BCrypt est une fonction de **hachage de mot de passe**. Ce n'est pas du
chiffrement : un hash BCrypt ne peut pas être déchiffré pour retrouver le mot
de passe original.

### Pendant l'inscription

```java
String hash = passwordEncoder.encode(motDePasse);
```

Pour `briko1234`, BCrypt produit une valeur ressemblant à :

```text
$2a$10$L/mFTEu886LHxXCdLSZiRuToIbZ28rR5A3noYHm01GkW6bmpCy2/i
```

BCrypt ajoute automatiquement un sel aléatoire. Deux utilisateurs utilisant le
même mot de passe auront normalement deux hashes différents.

### Pendant la connexion

Conceptuellement, Spring effectue :

```java
boolean correct = passwordEncoder.matches(motDePasseRecu, hashEnBase);
```

BCrypt lit le sel et le coût contenus dans le hash, recalcule le résultat avec
le mot de passe reçu puis compare les valeurs.

Le bean actuel est :

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

Le constructeur par défaut utilise un coût de 10. Ce coût ralentit
volontairement chaque tentative afin de rendre les attaques par essais massifs
plus difficiles.

### Différence entre JWT et BCrypt

| BCrypt | JWT |
| --- | --- |
| Protège le mot de passe enregistré | Transporte une preuve de connexion |
| Produit un hash non réversible | Produit un token signé |
| Utilisé à l'inscription et à la connexion | Utilisé après la connexion |
| Stocké dans PostgreSQL | Conservé temporairement par le client |
| Ne doit jamais être envoyé au frontend | Doit être envoyé dans `Authorization` |

## Règles d'accès actuelles

`SecurityConfig.securityFilterChain` définit :

| Routes | Accès |
| --- | --- |
| `POST /api/auth/**` | Public |
| `GET /api/categories/**` | Public |
| `GET /api/artisans/**` | Public |
| `/api/admin/**` | JWT valide avec rôle `ADMIN` |
| Toute autre route | JWT valide, quel que soit le rôle |

La session Spring est configurée en `STATELESS`. Le serveur ne mémorise pas une
session entre deux requêtes : le token doit être envoyé à chaque appel protégé.

CSRF est désactivé car l'API actuelle utilise un Bearer token dans le header et
pas une session ou un cookie d'authentification automatique. Cette décision
devra être revue si le futur frontend utilise un cookie pour l'authentification.

## Utilisation avec `curl`

### Démarrer le backend

Depuis la racine du projet :

```bash
docker compose up -d
cd backend
./mvnw spring-boot:run
```

### Inscrire un client

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "nom": "Nadine Tchoumi",
    "telephone": "+237699123456",
    "email": "nadine@example.cm",
    "motDePasse": "briko5678",
    "role": "CLIENT"
  }'
```

### Connecter le compte administrateur de démonstration

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "telephone": "+237600000001",
    "motDePasse": "briko1234"
  }'
```

Réponse :

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "nom": "Admin Briko",
  "role": "ADMIN"
}
```

Pour une future route protégée, le token devra être envoyé ainsi :

```bash
curl http://localhost:8080/api/route-protegee \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...'
```

`/api/route-protegee` est seulement un exemple : cette route n'existe pas dans
la phase 0.

## Protéger une future route

Une nouvelle route qui ne fait partie d'aucun matcher public est déjà couverte
par :

```java
.anyRequest().authenticated()
```

Elle exigera donc automatiquement un JWT valide.

Pour réserver un groupe de routes à un rôle, ajouter le matcher avant
`anyRequest()` :

```java
.requestMatchers("/api/prestataire/**").hasRole("PRESTATAIRE")
.anyRequest().authenticated()
```

L'ordre est important : Spring utilise la première règle qui correspond à la
requête.

Un controller peut recevoir l'identité authentifiée sans relire le header :

```java
@GetMapping("/api/me")
public String me(Authentication authentication) {
    return authentication.getName(); // téléphone Briko
}
```

Pour garder le service métier indépendant de Spring Security, le controller
peut ensuite transmettre explicitement ce téléphone au service.

## Réponses d'erreur

| Statut | Situation |
| --- | --- |
| `400 Bad Request` | DTO invalide |
| `401 Unauthorized` | Mauvais identifiants, token absent ou invalide |
| `403 Forbidden` | Utilisateur authentifié sans le rôle nécessaire |
| `409 Conflict` | Téléphone déjà utilisé ou inscription publique `ADMIN` |
| `500 Internal Server Error` | Erreur technique inattendue |

Les erreurs de controller et de service passent par `GlobalExceptionHandler`.
Les erreurs 401/403 produites avant le controller par Spring Security sont
écrites par `SecurityConfig.writeSecurityError`. Les deux chemins utilisent le
même record `ApiError`, donc le frontend reçoit toujours une structure stable.

## Limites actuelles et précautions

- Il n'existe pas encore de refresh token.
- Il n'existe pas encore de liste de révocation des JWT.
- Se déconnecter côté frontend signifie actuellement supprimer le token local.
- Un token volé reste utilisable jusqu'à son expiration, sauf si le compte est
  désactivé en base.
- `JWT_SECRET` doit être long, aléatoire, différent par environnement et ne
  jamais être commité.
- Le token et les mots de passe ne doivent jamais être écrits dans les logs.
- HTTPS est indispensable en production pour protéger le header
  `Authorization` pendant le transport.
- Pour le futur frontend web, conserver le token uniquement en mémoire limite
  l'exposition aux attaques XSS. `localStorage` est pratique mais accessible au
  JavaScript injecté; un cookie `HttpOnly` nécessiterait une adaptation de la
  stratégie actuelle et une protection CSRF appropriée.
- Une limitation du nombre de tentatives de connexion devra être ajoutée avant
  la production.
