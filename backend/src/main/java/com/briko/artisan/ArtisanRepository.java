package com.briko.artisan;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Accès aux profils artisans.
 *
 * <p>Spring Data lit chaque nom de méthode et génère automatiquement la
 * requête SQL correspondante. Par exemple,
 * {@code findDistinctByVilleIgnoreCaseAndStatutOrderByNomAffichageAsc}
 * devient une recherche filtrée par ville et statut, insensible à la casse,
 * triée par nom. Il n'est donc pas nécessaire d'écrire un {@code @Query} pour
 * ces recherches simples.</p>
 *
 * <p>{@link EntityGraph} ne remplace pas la requête dérivée : il précise
 * seulement quelles relations LAZY doivent être chargées pour construire les
 * DTO sans déclencher une requête supplémentaire par artisan.</p>
 */
public interface ArtisanRepository extends JpaRepository<Artisan, Long> {

    @EntityGraph(attributePaths = "categories")
    List<Artisan> findDistinctByStatutOrderByNomAffichageAsc(StatutArtisan statut);

    @EntityGraph(attributePaths = "categories")
    List<Artisan> findDistinctByVilleIgnoreCaseAndStatutOrderByNomAffichageAsc(
            String ville,
            StatutArtisan statut
    );

    @EntityGraph(attributePaths = "categories")
    List<Artisan> findDistinctByCategoriesSlugIgnoreCaseAndStatutOrderByNomAffichageAsc(
            String categorieSlug,
            StatutArtisan statut
    );

    @EntityGraph(attributePaths = "categories")
    List<Artisan> findDistinctByVilleIgnoreCaseAndCategoriesSlugIgnoreCaseAndStatutOrderByNomAffichageAsc(
            String ville,
            String categorieSlug,
            StatutArtisan statut
    );

    @EntityGraph(attributePaths = {"categories", "utilisateur"})
    Optional<Artisan> findByIdAndStatut(Long id, StatutArtisan statut);
}
