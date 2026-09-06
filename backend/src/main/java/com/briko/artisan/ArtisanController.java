package com.briko.artisan;

import java.util.List;

import com.briko.artisan.dto.ArtisanDetailDTO;
import com.briko.artisan.dto.ArtisanResumeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Entrée HTTP publique du domaine Artisan.
 *
 * <p>Le controller se limite au contrat HTTP et délègue les filtres ainsi que
 * la règle de visibilité au service. Il ne manipule jamais une entité JPA.</p>
 */
@RestController
@RequestMapping("/api/artisans")
@RequiredArgsConstructor
public class ArtisanController {

    private final ArtisanService artisanService;

    @GetMapping
    public ResponseEntity<List<ArtisanResumeDTO>> rechercher(
            @RequestParam(required = false) String ville,
            @RequestParam(name = "categorie", required = false) String categorieSlug
    ) {
        return ResponseEntity.ok(artisanService.rechercher(ville, categorieSlug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtisanDetailDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(artisanService.findById(id));
    }
}
