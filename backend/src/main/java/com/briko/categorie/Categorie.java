package com.briko.categorie;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité JPA représentant un métier BTP proposé sur Briko.
 * Son mapping reproduit la table categorie ; elle reste dans le repository et
 * le service et ne doit jamais être exposée directement par le controller.
 */
@Entity
@Table(name = "categorie")
@Getter
@Setter
@NoArgsConstructor
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom", nullable = false, unique = true, length = 80)
    private String nom;

    @Column(name = "slug", nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "icone", length = 60)
    private String icone;

    @Column(name = "ordre_affichage", nullable = false)
    private int ordreAffichage;

    @Column(name = "actif", nullable = false)
    private boolean actif = true;
}
