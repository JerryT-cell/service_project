package com.briko.artisan;

/**
 * Cycle de validation d'un profil artisan.
 * Seul {@link #VALIDE} autorise une exposition sur les endpoints publics.
 */
public enum StatutArtisan {
    EN_ATTENTE,
    VALIDE,
    REJETE,
    SUSPENDU,
    A_RECONTACTER
}
