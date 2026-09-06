package com.briko.common.security;

import com.briko.utilisateur.Utilisateur;
import com.briko.utilisateur.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Adaptateur entre les comptes Briko et le format attendu par Spring Security.
 * Charge un utilisateur par téléphone, qui est l'identifiant de connexion ;
 * aucune authentification HTTP ou génération de token n'a lieu ici.
 */
@Service
@RequiredArgsConstructor
public class UtilisateurDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String telephone) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByTelephone(telephone)
                .orElseThrow(() -> new UsernameNotFoundException("Identifiants invalides."));

        return User.withUsername(utilisateur.getTelephone())
                .password(utilisateur.getMotDePasseHash())
                .roles(utilisateur.getRole().name())
                .disabled(!utilisateur.isActif())
                .build();
    }
}
