-- Corrige uniquement les comptes créés par V2.
-- Leur mot de passe de développement est "briko1234" ; ce hash BCrypt
-- ne doit jamais être réutilisé pour des comptes de production.
UPDATE utilisateur
SET mot_de_passe_hash = '$2a$10$L/mFTEu886LHxXCdLSZiRuToIbZ28rR5A3noYHm01GkW6bmpCy2/i'
WHERE telephone IN (
    '+237600000001',
    '+237690000101',
    '+237690000102',
    '+237690000103',
    '+237690000104',
    '+237690000105',
    '+237670000201'
);
