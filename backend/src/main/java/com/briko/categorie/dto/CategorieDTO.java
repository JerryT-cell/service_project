package com.briko.categorie.dto;

/**
 * Représentation publique d'une catégorie BTP.
 * Ce DTO contient uniquement les informations utiles au frontend et évite
 * d'exposer l'entité JPA ou ses champs de gestion interne.
 */
public record CategorieDTO(
        Long id,
        String nom,
        String slug,
        String description,
        String icone
) {
}
