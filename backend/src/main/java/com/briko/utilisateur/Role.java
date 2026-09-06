package com.briko.utilisateur;

/**
 * Rôles possibles pour un compte Briko.
 * Ces valeurs doivent rester identiques à la contrainte SQL de la table
 * utilisateur ; les permissions HTTP sont définies dans SecurityConfig.
 */
public enum Role {
    CLIENT,
    PRESTATAIRE,
    ADMIN
}
