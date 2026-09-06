package com.briko.artisan;

import java.util.List;

import com.briko.artisan.dto.ArtisanDetailDTO;
import com.briko.artisan.dto.ArtisanResumeDTO;
import com.briko.categorie.Categorie;

/**
 * Convertit les entités Artisan en objets destinés à l'API.
 *
 * <p>Ce mapper est volontairement écrit à la main : chaque champ exposé est
 * visible et auditable. Ses méthodes sont statiques et sans dépendance, car la
 * conversion ne porte aucune règle nécessitant un service Spring.</p>
 */
public final class ArtisanMapper {

    private ArtisanMapper() {
        // Classe utilitaire : elle ne doit pas être instanciée.
    }

    public static ArtisanResumeDTO toResumeDTO(Artisan artisan) {
        return new ArtisanResumeDTO(
                artisan.getId(),
                artisan.getNomAffichage(),
                artisan.getVille(),
                artisan.getQuartier(),
                extractCategoryNames(artisan),
                artisan.getNoteMoyenne(),
                artisan.getNombreAvis(),
                artisan.getPhotoProfilUrl(),
                isVerified(artisan)
        );
    }

    public static ArtisanDetailDTO toDetailDTO(Artisan artisan) {
        return new ArtisanDetailDTO(
                artisan.getId(),
                artisan.getNomAffichage(),
                artisan.getVille(),
                artisan.getQuartier(),
                extractCategoryNames(artisan),
                artisan.getNoteMoyenne(),
                artisan.getNombreAvis(),
                artisan.getPhotoProfilUrl(),
                isVerified(artisan),
                artisan.getDescription(),
                artisan.getZoneIntervention(),
                artisan.getAnneesExperience(),
                artisan.getUtilisateur().getTelephone(),
                artisan.getDateValidation()
        );
    }

    private static List<String> extractCategoryNames(Artisan artisan) {
        return artisan.getCategories()
                .stream()
                .map(Categorie::getNom)
                .toList();
    }

    /**
     * Le schéma ne possède pas de colonne « verifie » : le badge public est la
     * traduction du statut VALIDE attribué après le contrôle manuel Briko.
     */
    private static boolean isVerified(Artisan artisan) {
        return artisan.getStatut() == StatutArtisan.VALIDE;
    }
}
