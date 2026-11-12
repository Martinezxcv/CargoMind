package com.cargomind.backend.exception;

/** Business rule violation that bean validation cannot express (e.g. origin equals destination). */
public class InvalidOfferException extends RuntimeException {

    public InvalidOfferException(String message) {
        super(message);
    }
}