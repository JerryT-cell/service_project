package com.briko.artisan;

import java.util.List;
import java.util.Locale;

import com.briko.artisan.dto.ArtisanDetailDTO;
import com.briko.artisan.dto.ArtisanResumeDTO;
import com.briko.common.exception.RessourceIntrouvableException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Porte les cas d'usage publics du domaine Artisan.
 * Les controllers lui transmettent les critères HTTP, mais ne choisissent
 * jamais eux-mêmes quels profils ont le droit d'être exposés.
 */
@Service
@RequiredArgsConstructor
public class ArtisanService {

    private static final StatutArtisan STATUT_PUBLIC = StatutArtisan.VALIDE;

    private final ArtisanRepository artisanRepository;

    /**
     * Recherche publique avec des filtres tous deux facultatifs.
     *
     * <p><strong>Règle métier centrale :</strong> seuls les artisans au statut
     * VALIDE sont visibles publiquement. Le statut est imposé ici dans chacune
     * des quatre branches ; il ne vient jamais du client. Ainsi, un profil en
     * attente, rejeté ou suspendu reste invisible même si ses autres critères
     * correspondent à la recherche.</p>
     */
    @Transactional(readOnly = true)
    public List<ArtisanResumeDTO> rechercher(String ville, String categorieSlug) {
        String villeNormalisee = normalize(ville);
        String categorieNormalisee = normalizeSlug(categorieSlug);

        List<Artisan> artisans;
        if (villeNormalisee != null && categorieNormalisee != null) {
            artisans = artisanRepository
                    .findDistinctByVilleIgnoreCaseAndCategoriesSlugIgnoreCaseAndStatutOrderByNomAffichageAsc(
                            villeNormalisee,
                            categorieNormalisee,
                            STATUT_PUBLIC
                    );
        } else if (villeNormalisee != null) {
            artisans = artisanRepository
                    .findDistinctByVilleIgnoreCaseAndStatutOrderByNomAffichageAsc(
                            villeNormalisee,
                            STATUT_PUBLIC
                    );
        } else if (categorieNormalisee != null) {
            artisans = artisanRepository
                    .findDistinctByCategoriesSlugIgnoreCaseAndStatutOrderByNomAffichageAsc(
                            categorieNormalisee,
                            STATUT_PUBLIC
                    );
        } else {
            artisans = artisanRepository
                    .findDistinctByStatutOrderByNomAffichageAsc(STATUT_PUBLIC);
        }

        return artisans.stream()
                .map(ArtisanMapper::toResumeDTO)
                .toList();
    }

    /**
     * Retourne une fiche seulement si elle appartient à un artisan validé.
     * Chercher simultanément par identifiant et statut produit volontairement
     * le même 404 pour un identifiant absent et pour un profil non public.
     */
    @Transactional(readOnly = true)
    public ArtisanDetailDTO findById(Long id) {
        return artisanRepository.findByIdAndStatut(id, STATUT_PUBLIC)
                .map(ArtisanMapper::toDetailDTO)
                .orElseThrow(() -> new RessourceIntrouvableException(
                        "Artisan introuvable."
                ));
    }

    private String normalize(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String normalizeSlug(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
    }
}
