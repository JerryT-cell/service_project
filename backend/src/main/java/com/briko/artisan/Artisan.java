package com.briko.artisan;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.briko.categorie.Categorie;
import com.briko.utilisateur.Utilisateur;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Profil métier d'un utilisateur prestataire.
 *
 * <p>L'entité reproduit la table {@code artisan}. Elle reste interne à la
 * couche de données : l'API expose uniquement les DTO prévus pour chaque cas
 * d'usage, jamais cette entité JPA.</p>
 *
 * <p>Toutes les relations sont chargées en {@link FetchType#LAZY LAZY}. Cela
 * évite de lire automatiquement l'utilisateur et ses catégories lorsqu'une
 * opération n'en a pas besoin. Le repository choisit explicitement les
 * relations nécessaires aux lectures publiques.</p>
 */
@Entity
@Table(name = "artisan")
@Getter
@Setter
@NoArgsConstructor
public class Artisan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Compte propriétaire du profil artisan. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "nom_affichage", nullable = false, length = 120)
    private String nomAffichage;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "ville", nullable = false, length = 80)
    private String ville;

    @Column(name = "quartier", length = 120)
    private String quartier;

    @Column(name = "zone_intervention", length = 300)
    private String zoneIntervention;

    @Column(name = "annees_experience")
    private Integer anneesExperience;

    @Column(name = "photo_profil_url", length = 500)
    private String photoProfilUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutArtisan statut = StatutArtisan.EN_ATTENTE;

    @Column(name = "note_moyenne", nullable = false, precision = 3, scale = 2)
    private BigDecimal noteMoyenne = BigDecimal.ZERO;

    @Column(name = "nombre_avis", nullable = false)
    private int nombreAvis;

    @Column(name = "date_validation")
    private OffsetDateTime dateValidation;

    /** Administrateur ayant pris la décision de validation, si elle existe. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "valide_par_id")
    private Utilisateur validePar;

    @Column(name = "date_creation", nullable = false)
    private OffsetDateTime dateCreation;

    @Column(name = "date_modification", nullable = false)
    private OffsetDateTime dateModification;

    /**
     * Métiers exercés par l'artisan.
     * La table de jointure possède une clé primaire composée qui empêche les
     * doublons. L'ordre d'affichage des catégories rend le JSON déterministe.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "artisan_categorie",
            joinColumns = @JoinColumn(name = "artisan_id"),
            inverseJoinColumns = @JoinColumn(name = "categorie_id")
    )
    @OrderBy("ordreAffichage ASC")
    private List<Categorie> categories = new ArrayList<>();

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
