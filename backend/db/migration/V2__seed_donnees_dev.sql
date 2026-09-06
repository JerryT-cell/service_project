-- Données de démarrage.
-- Les catégories sont des données de référence : elles restent en production.
-- Les artisans de démonstration servent à ce que le frontend ait quelque chose
-- à afficher pendant le développement. À retirer avant la mise en production.

INSERT INTO categorie (nom, slug, description, ordre_affichage) VALUES
    ('Plombier',    'plombier',    'Installation et réparation de plomberie sanitaire', 1),
    ('Électricien', 'electricien', 'Installation électrique, dépannage, mise aux normes', 2),
    ('Maçon',       'macon',       'Construction, dalles, murs, fondations', 3),
    ('Peintre',     'peintre',     'Peinture intérieure et extérieure, enduits', 4),
    ('Menuisier',   'menuisier',   'Portes, fenêtres, meubles sur mesure', 5),
    ('Carreleur',   'carreleur',   'Pose de carrelage sol et mur', 6),
    ('Vitrier',     'vitrier',     'Pose et remplacement de vitrages', 7),
    ('Soudeur',     'soudeur',     'Ferronnerie, portails, grilles', 8),
    ('Frigoriste',  'frigoriste',  'Climatisation et froid', 9);

-- Mot de passe de tous les comptes de démo : "briko1234"
-- (hash BCrypt — à ne jamais réutiliser en production)
INSERT INTO utilisateur (nom, telephone, email, mot_de_passe_hash, role) VALUES
    ('Admin Briko',    '+237600000001', 'admin@briko.cm',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
    ('Jean Nkongo',    '+237690000101', NULL,              '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRESTATAIRE'),
    ('Paul Mbarga',    '+237690000102', NULL,              '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRESTATAIRE'),
    ('Alice Ngo Bell', '+237690000103', NULL,              '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRESTATAIRE'),
    ('Éric Fotso',     '+237690000104', NULL,              '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRESTATAIRE'),
    ('Marie Ekotto',   '+237690000105', NULL,              '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PRESTATAIRE'),
    ('Client Test',    '+237670000201', 'client@test.cm',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENT');

INSERT INTO artisan (utilisateur_id, nom_affichage, description, ville, quartier, zone_intervention, annees_experience, statut, note_moyenne, nombre_avis, date_validation, valide_par_id)
SELECT u.id, 'Jean Nkongo', 'Plombier depuis 12 ans, spécialisé en installation sanitaire et réparation de fuites. Intervention rapide.', 'Douala', 'Akwa', 'Akwa, Bonanjo, Deïdo', 12, 'VALIDE', 4.70, 0, NOW(), (SELECT id FROM utilisateur WHERE telephone = '+237600000001')
FROM utilisateur u WHERE u.telephone = '+237690000101';

INSERT INTO artisan (utilisateur_id, nom_affichage, description, ville, quartier, zone_intervention, annees_experience, statut, note_moyenne, nombre_avis, date_validation, valide_par_id)
SELECT u.id, 'Paul Mbarga', 'Électricien qualifié, mise aux normes et dépannage. Devis gratuit.', 'Douala', 'Bonapriso', 'Bonapriso, Bali, Akwa', 8, 'VALIDE', 4.20, 0, NOW(), (SELECT id FROM utilisateur WHERE telephone = '+237600000001')
FROM utilisateur u WHERE u.telephone = '+237690000102';

INSERT INTO artisan (utilisateur_id, nom_affichage, description, ville, quartier, zone_intervention, annees_experience, statut, note_moyenne, nombre_avis, date_validation, valide_par_id)
SELECT u.id, 'Alice Ngo Bell', 'Peintre en bâtiment. Finitions soignées, intérieur et extérieur.', 'Douala', 'Bonamoussadi', 'Bonamoussadi, Makepe', 6, 'VALIDE', 4.90, 0, NOW(), (SELECT id FROM utilisateur WHERE telephone = '+237600000001')
FROM utilisateur u WHERE u.telephone = '+237690000103';

INSERT INTO artisan (utilisateur_id, nom_affichage, description, ville, quartier, zone_intervention, annees_experience, statut, note_moyenne, nombre_avis, date_validation, valide_par_id)
SELECT u.id, 'Éric Fotso', 'Maçon, gros œuvre et dalles. Équipe de 4 personnes disponible.', 'Douala', 'Ndokotti', 'Ndokotti, New Bell, Bepanda', 15, 'VALIDE', 4.40, 0, NOW(), (SELECT id FROM utilisateur WHERE telephone = '+237600000001')
FROM utilisateur u WHERE u.telephone = '+237690000104';

-- Celle-ci reste en attente : utile pour tester la file de validation admin
INSERT INTO artisan (utilisateur_id, nom_affichage, description, ville, quartier, zone_intervention, annees_experience, statut)
SELECT u.id, 'Marie Ekotto', 'Carreleuse, pose sol et mur.', 'Douala', 'Logbaba', 'Logbaba, Ndogbong', 4, 'EN_ATTENTE'
FROM utilisateur u WHERE u.telephone = '+237690000105';

INSERT INTO artisan_categorie (artisan_id, categorie_id)
SELECT a.id, c.id FROM artisan a, categorie c
WHERE (a.nom_affichage = 'Jean Nkongo'    AND c.slug = 'plombier')
   OR (a.nom_affichage = 'Paul Mbarga'    AND c.slug = 'electricien')
   OR (a.nom_affichage = 'Alice Ngo Bell' AND c.slug = 'peintre')
   OR (a.nom_affichage = 'Éric Fotso'     AND c.slug = 'macon')
   OR (a.nom_affichage = 'Éric Fotso'     AND c.slug = 'carreleur')
   OR (a.nom_affichage = 'Marie Ekotto'   AND c.slug = 'carreleur');
