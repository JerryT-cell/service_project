package com.briko.categorie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Accès aux catégories stockées en base de données.
 * Spring Data génère la requête de lecture à partir du nom de la méthode ;
 * aucune règle métier ou conversion en DTO ne doit être ajoutée ici.
 */
public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    List<Categorie> findAllByActifTrueOrderByOrdreAffichageAsc();
}
