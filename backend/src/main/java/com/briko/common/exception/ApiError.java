package com.briko.common.exception;

import java.time.Instant;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Format JSON commun à toutes les erreurs renvoyées par l'API.
 * Le détail par champ est réservé aux erreurs de validation et reste absent
 * des autres réponses afin de garder un contrat simple et régulier.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        Instant timestamp,
        int status,
        String erreur,
        String message,
        String chemin,
        Map<String, String> champs
) {
}
