package com.briko.artisan.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Représentation légère d'un artisan dans les listes et résultats de recherche.
 *
 * <p>Le téléphone est volontairement absent : une liste publique ne doit pas
 * diffuser cette donnée. Il n'est exposé que lorsque le client ouvre la fiche
 * détaillée d'un artisan.</p>
 */
public record ArtisanResumeDTO(
        Long id,
        String nomAffichage,
        String ville,
        String quartier,
        List<String> categories,
        BigDecimal noteMoyenne,
        int nombreAvis,
        String photoProfilUrl,
        boolean verifie
) {
}
