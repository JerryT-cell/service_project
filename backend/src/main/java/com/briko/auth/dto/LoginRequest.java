package com.briko.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Identifiants reçus pour ouvrir une session sans état.
 * Ce DTO valide uniquement la forme des données et ne révèle jamais quelle
 * valeur est incorrecte lors d'un échec d'authentification.
 */
public record LoginRequest(
        @NotBlank(message = "Le téléphone est obligatoire.")
        @Pattern(
                regexp = "^\\+237\\d{9}$",
                message = "Le téléphone doit commencer par +237 et contenir 9 chiffres."
        )
        String telephone,

        @NotBlank(message = "Le mot de passe est obligatoire.")
        String motDePasse
) {

    @Override
    public String toString() {
        return "LoginRequest[telephone=" + telephone + ", motDePasse=PROTEGE]";
    }
}
