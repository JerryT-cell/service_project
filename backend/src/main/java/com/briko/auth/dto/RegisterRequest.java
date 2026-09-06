package com.briko.auth.dto;

import com.briko.utilisateur.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Données reçues pour créer un compte client ou prestataire.
 * Les validations simples restent dans ce DTO ; les décisions métier, comme
 * l'unicité du téléphone, appartiennent à AuthService.
 */
public record RegisterRequest(
        @NotBlank(message = "Le nom est obligatoire.")
        @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères.")
        String nom,

        @NotBlank(message = "Le téléphone est obligatoire.")
        @Pattern(
                regexp = "^\\+237\\d{9}$",
                message = "Le téléphone doit commencer par +237 et contenir 9 chiffres."
        )
        String telephone,

        @Email(message = "L'adresse email doit être valide.")
        @Size(max = 180, message = "L'adresse email ne doit pas dépasser 180 caractères.")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire.")
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
        String motDePasse,

        @NotNull(message = "Le rôle est obligatoire.")
        Role role
) {

    @Override
    public String toString() {
        return "RegisterRequest[nom=" + nom
                + ", telephone=" + telephone
                + ", email=" + email
                + ", motDePasse=PROTEGE"
                + ", role=" + role + "]";
    }
}
