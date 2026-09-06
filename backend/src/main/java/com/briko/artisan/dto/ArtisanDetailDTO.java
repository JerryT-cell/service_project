package com.briko.artisan.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Fiche publique complète d'un artisan validé.
 * Le téléphone apparaît ici, contrairement au DTO de liste, car cette fiche
 * correspond à l'intention explicite de consulter puis contacter l'artisan.
 */
public record ArtisanDetailDTO(
        Long id,
        String nomAffichage,
        String ville,
        String quartier,
        List<String> categories,
        BigDecimal noteMoyenne,
        int nombreAvis,
        String photoProfilUrl,
        boolean verifie,
        String description,
        String zoneIntervention,
        Integer anneesExperience,
        String telephone,
        OffsetDateTime dateValidation
) {
}
