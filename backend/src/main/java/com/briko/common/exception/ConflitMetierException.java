package com.briko.common.exception;

/**
 * Exception signalant qu'une action enfreint une règle métier existante.
 * Les services l'utilisent pour produire une réponse HTTP 409 cohérente ;
 * elle ne sert pas à représenter les erreurs techniques.
 */
public class ConflitMetierException extends RuntimeException {

    public ConflitMetierException(String message) {
        super(message);
    }
}
