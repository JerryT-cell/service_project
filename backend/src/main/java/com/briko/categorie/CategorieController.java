package com.briko.categorie;

import java.util.List;

import com.briko.categorie.dto.CategorieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Couche HTTP du domaine Catégorie.
 * Expose la liste publique des métiers actifs et délègue entièrement la
 * sélection au service ; aucune logique métier ne doit être ajoutée ici.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final CategorieService categorieService;

    @GetMapping
    public ResponseEntity<List<CategorieDTO>> findAllActives() {
        return ResponseEntity.ok(categorieService.findAllActives());
    }
}
