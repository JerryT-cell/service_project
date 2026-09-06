package com.briko.auth.dto;

import com.briko.utilisateur.Role;

/**
 * Réponse renvoyée après une inscription ou une connexion réussie.
 * Elle expose le token et les informations publiques minimales du compte,
 * jamais le hash du mot de passe ni l'entité JPA.
 */
public record AuthResponse(
        String token,
        Long id,
        String nom,
        Role role
) {

    @Override
    public String toString() {
        return "AuthResponse[token=PROTEGE, id=" + id
                + ", nom=" + nom
                + ", role=" + role + "]";
    }
}
