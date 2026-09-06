-- Briko — schéma initial du MVP
-- Convention : noms de tables et colonnes en français (domaine métier),
-- au singulier, en snake_case.

-- ---------------------------------------------------------------
-- utilisateur : tout compte de la plateforme, quel que soit le rôle
-- ---------------------------------------------------------------
CREATE TABLE utilisateur (
    id                  BIGSERIAL PRIMARY KEY,
    nom                 VARCHAR(120)  NOT NULL,
    telephone           VARCHAR(30)   NOT NULL,
    email               VARCHAR(180),
    mot_de_passe_hash   VARCHAR(255)  NOT NULL,
    role                VARCHAR(20)   NOT NULL,
    actif               BOOLEAN       NOT NULL DEFAULT TRUE,
    date_creation       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    date_modification   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_utilisateur_telephone UNIQUE (telephone),
    CONSTRAINT uq_utilisateur_email     UNIQUE (email),
    CONSTRAINT ck_utilisateur_role      CHECK (role IN ('CLIENT', 'PRESTATAIRE', 'ADMIN'))
);

-- ---------------------------------------------------------------
-- categorie : les métiers BTP (plombier, électricien, maçon...)
-- ---------------------------------------------------------------
CREATE TABLE categorie (
    id                BIGSERIAL PRIMARY KEY,
    nom               VARCHAR(80)  NOT NULL,
    slug              VARCHAR(80)  NOT NULL,
    description       VARCHAR(500),
    icone             VARCHAR(60),
    ordre_affichage   INTEGER      NOT NULL DEFAULT 0,
    actif             BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_categorie_nom  UNIQUE (nom),
    CONSTRAINT uq_categorie_slug UNIQUE (slug)
);

-- ---------------------------------------------------------------
-- artisan : le profil public d'un prestataire validé
-- ---------------------------------------------------------------
CREATE TABLE artisan (
    id                   BIGSERIAL PRIMARY KEY,
    utilisateur_id       BIGINT        NOT NULL,
    nom_affichage        VARCHAR(120)  NOT NULL,
    description          VARCHAR(2000),
    ville                VARCHAR(80)   NOT NULL,
    quartier             VARCHAR(120),
    zone_intervention    VARCHAR(300),
    annees_experience    INTEGER,
    photo_profil_url     VARCHAR(500),
    statut               VARCHAR(20)   NOT NULL DEFAULT 'EN_ATTENTE',
    note_moyenne         NUMERIC(3,2)  NOT NULL DEFAULT 0.00,
    nombre_avis          INTEGER       NOT NULL DEFAULT 0,
    date_validation      TIMESTAMPTZ,
    valide_par_id        BIGINT,
    date_creation        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    date_modification    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_artisan_utilisateur  UNIQUE (utilisateur_id),
    CONSTRAINT fk_artisan_utilisateur  FOREIGN KEY (utilisateur_id)
        REFERENCES utilisateur (id) ON DELETE CASCADE,
    CONSTRAINT fk_artisan_valide_par   FOREIGN KEY (valide_par_id)
        REFERENCES utilisateur (id) ON DELETE SET NULL,
    CONSTRAINT ck_artisan_statut CHECK (
        statut IN ('EN_ATTENTE', 'VALIDE', 'REJETE', 'SUSPENDU', 'A_RECONTACTER')
    ),
    CONSTRAINT ck_artisan_note CHECK (note_moyenne >= 0 AND note_moyenne <= 5)
);

-- Un artisan peut exercer plusieurs métiers
CREATE TABLE artisan_categorie (
    artisan_id    BIGINT NOT NULL,
    categorie_id  BIGINT NOT NULL,

    CONSTRAINT pk_artisan_categorie PRIMARY KEY (artisan_id, categorie_id),
    CONSTRAINT fk_ac_artisan   FOREIGN KEY (artisan_id)
        REFERENCES artisan (id)   ON DELETE CASCADE,
    CONSTRAINT fk_ac_categorie FOREIGN KEY (categorie_id)
        REFERENCES categorie (id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- verification : la fiche interne remplie lors de la rencontre
-- ---------------------------------------------------------------
CREATE TABLE verification (
    id                     BIGSERIAL PRIMARY KEY,
    artisan_id             BIGINT       NOT NULL,
    verificateur_id        BIGINT       NOT NULL,
    date_rencontre         DATE,
    identite_verifiee      BOOLEAN      NOT NULL DEFAULT FALSE,
    travail_controle       BOOLEAN      NOT NULL DEFAULT FALSE,
    references_verifiees   BOOLEAN      NOT NULL DEFAULT FALSE,
    notes                  VARCHAR(2000),
    decision               VARCHAR(20)  NOT NULL,
    date_creation          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_verification_artisan      FOREIGN KEY (artisan_id)
        REFERENCES artisan (id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_verificateur FOREIGN KEY (verificateur_id)
        REFERENCES utilisateur (id),
    CONSTRAINT ck_verification_decision CHECK (
        decision IN ('VALIDE', 'REJETE', 'A_RECONTACTER')
    )
);

-- ---------------------------------------------------------------
-- contact : trace d'une mise en relation client <-> artisan
-- ---------------------------------------------------------------
CREATE TABLE contact (
    id              BIGSERIAL PRIMARY KEY,
    client_id       BIGINT       NOT NULL,
    artisan_id      BIGINT       NOT NULL,
    canal           VARCHAR(20)  NOT NULL,
    besoin          VARCHAR(1000),
    date_contact    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_contact_client  FOREIGN KEY (client_id)
        REFERENCES utilisateur (id) ON DELETE CASCADE,
    CONSTRAINT fk_contact_artisan FOREIGN KEY (artisan_id)
        REFERENCES artisan (id)     ON DELETE CASCADE,
    CONSTRAINT ck_contact_canal CHECK (canal IN ('WHATSAPP', 'APPEL'))
);

-- ---------------------------------------------------------------
-- avis : une note liée à un contact enregistré (un avis par contact)
-- ---------------------------------------------------------------
CREATE TABLE avis (
    id                  BIGSERIAL PRIMARY KEY,
    contact_id          BIGINT       NOT NULL,
    client_id           BIGINT       NOT NULL,
    artisan_id          BIGINT       NOT NULL,
    note                SMALLINT     NOT NULL,
    commentaire         VARCHAR(2000),
    statut_moderation   VARCHAR(20)  NOT NULL DEFAULT 'PUBLIE',
    date_creation       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_avis_contact  UNIQUE (contact_id),
    CONSTRAINT fk_avis_contact  FOREIGN KEY (contact_id)
        REFERENCES contact (id)     ON DELETE CASCADE,
    CONSTRAINT fk_avis_client   FOREIGN KEY (client_id)
        REFERENCES utilisateur (id) ON DELETE CASCADE,
    CONSTRAINT fk_avis_artisan  FOREIGN KEY (artisan_id)
        REFERENCES artisan (id)     ON DELETE CASCADE,
    CONSTRAINT ck_avis_note CHECK (note BETWEEN 1 AND 5),
    CONSTRAINT ck_avis_moderation CHECK (
        statut_moderation IN ('PUBLIE', 'MASQUE', 'SIGNALE')
    )
);

-- ---------------------------------------------------------------
-- Index — pensés pour les requêtes du MVP
-- ---------------------------------------------------------------
CREATE INDEX idx_artisan_ville_statut  ON artisan (ville, statut);
CREATE INDEX idx_artisan_statut        ON artisan (statut);
CREATE INDEX idx_ac_categorie          ON artisan_categorie (categorie_id);
CREATE INDEX idx_contact_client        ON contact (client_id, date_contact DESC);
CREATE INDEX idx_contact_artisan       ON contact (artisan_id, date_contact DESC);
CREATE INDEX idx_avis_artisan          ON avis (artisan_id, date_creation DESC);
CREATE INDEX idx_verification_artisan  ON verification (artisan_id);
