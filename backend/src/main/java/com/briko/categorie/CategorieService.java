package com.briko.categorie;

import java.util.List;

import com.briko.categorie.dto.CategorieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Couche service du domaine Catégorie.
 * Sélectionne les métiers actifs et convertit les entités en DTO ; elle ne
 * connaît ni HTTP ni SQL et porte les futures règles métier de ce domaine.
 */
@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;

    @Transactional(readOnly = true)
    public List<CategorieDTO> findAllActives() {
        return categorieRepository.findAllByActifTrueOrderByOrdreAffichageAsc()
                .stream()
                .map(categorie -> new CategorieDTO(
                        categorie.getId(),
                        categorie.getNom(),
                        categorie.getSlug(),
                        categorie.getDescription(),
                        categorie.getIcone()
                ))
                .toList();
    }
}
