package com.briko.auth;

import com.briko.auth.dto.AuthResponse;
import com.briko.auth.dto.LoginRequest;
import com.briko.auth.dto.RegisterRequest;
import com.briko.common.exception.ConflitMetierException;
import com.briko.common.security.JwtService;
import com.briko.utilisateur.Role;
import com.briko.utilisateur.Utilisateur;
import com.briko.utilisateur.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Couche service du domaine Auth : inscrit et authentifie les utilisateurs.
 * Contient les règles d'unicité, de rôle et de mot de passe ; elle ne connaît
 * ni HTTP ni JSON et ne renvoie jamais l'entité Utilisateur.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String IDENTIFIANTS_INVALIDES =
            "Téléphone ou mot de passe incorrect.";

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByTelephone(request.telephone())) {
            throw new ConflitMetierException("Ce numéro de téléphone est déjà utilisé.");
        }

        if (request.role() == Role.ADMIN) {
            throw new ConflitMetierException(
                    "Le rôle ADMIN ne peut pas être attribué par l'inscription publique."
            );
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.nom().trim());
        utilisateur.setTelephone(request.telephone());
        utilisateur.setEmail(normalizeEmail(request.email()));
        utilisateur.setMotDePasseHash(passwordEncoder.encode(request.motDePasse()));
        utilisateur.setRole(request.role());

        Utilisateur utilisateurEnregistre = utilisateurRepository.save(utilisateur);

        return buildResponse(utilisateurEnregistre);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.telephone(),
                            request.motDePasse()
                    )
            );
        } catch (AuthenticationException exception) {
            throw new BadCredentialsException(IDENTIFIANTS_INVALIDES);
        }

        Utilisateur utilisateur = utilisateurRepository.findByTelephone(request.telephone())
                .orElseThrow(() -> new BadCredentialsException(IDENTIFIANTS_INVALIDES));

        return buildResponse(utilisateur);
    }

    private AuthResponse buildResponse(Utilisateur utilisateur) {
        return new AuthResponse(
                jwtService.generateToken(utilisateur),
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getRole()
        );
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim();
    }
}
