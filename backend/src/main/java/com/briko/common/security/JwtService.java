package com.briko.common.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import com.briko.utilisateur.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Service technique chargé de créer et de vérifier les tokens JWT.
 * Il place uniquement l'identité et le rôle dans le token ; les règles
 * d'autorisation restent dans SecurityConfig et les services métier.
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final Environment environment;

    public String generateToken(Utilisateur utilisateur) {
        Instant maintenant = Instant.now();
        long expirationMs = environment.getRequiredProperty(
                "briko.jwt.expiration-ms",
                Long.class
        );

        return Jwts.builder()
                .subject(utilisateur.getTelephone())
                .claim("id", utilisateur.getId())
                .claim("role", utilisateur.getRole().name())
                .issuedAt(Date.from(maintenant))
                .expiration(Date.from(maintenant.plusMillis(expirationMs)))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractTelephone(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = extractAllClaims(token);
            String telephone = claims.getSubject();
            Date expiration = claims.getExpiration();

            return userDetails.isEnabled()
                    && userDetails.getUsername().equals(telephone)
                    && expiration != null
                    && expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        String secret = environment.getRequiredProperty("briko.jwt.secret");
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
