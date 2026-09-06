package com.briko.utilisateur;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Accès aux comptes stockés dans la table utilisateur.
 * Spring Data fournit les opérations courantes et génère les recherches par
 * téléphone ; aucune règle métier ne doit être placée dans ce repository.
 */
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByTelephone(String telephone);

    boolean existsByTelephone(String telephone);
}
