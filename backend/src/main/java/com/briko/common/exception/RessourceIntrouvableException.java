package com.briko.common.exception;

/**
 * Exception métier signalant qu'une ressource demandée n'existe pas.
 * Les services la lèvent afin d'obtenir automatiquement une réponse HTTP 404 ;
 * les controllers ne doivent pas la capturer eux-mêmes.
 */
public class RessourceIntrouvableException extends RuntimeException {

    public RessourceIntrouvableException(String message) {
        super(message);
    }
}
