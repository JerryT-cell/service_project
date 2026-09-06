package com.briko.utilisateur;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité JPA représentant tout compte de la plateforme, quel que soit son rôle.
 * Son mapping reproduit la table utilisateur ; elle reste confinée aux
 * repositories et services et ne doit jamais être renvoyée par un controller.
 */
@Entity
@Table(name = "utilisateur")
@Getter
@Setter
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom", nullable = false, length = 120)
    private String nom;

    @Column(name = "telephone", nullable = false, unique = true, length = 30)
    private String telephone;

    @Column(name = "email", unique = true, length = 180)
    private String email;

    @Column(name = "mot_de_passe_hash", nullable = false, length = 255)
    private String motDePasseHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Column(name = "actif", nullable = false)
    private boolean actif = true;

    @Column(name = "date_creation", nullable = false)
    private OffsetDateTime dateCreation;

    @Column(name = "date_modification", nullable = false)
    private OffsetDateTime dateModification;

    @PrePersist
    void initializeDates() {
        OffsetDateTime maintenant = OffsetDateTime.now();
        if (dateCreation == null) {
            dateCreation = maintenant;
        }
        dateModification = maintenant;
    }

    @PreUpdate
    void updateModificationDate() {
        dateModification = OffsetDateTime.now();
    }
}
