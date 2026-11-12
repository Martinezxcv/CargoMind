package com.cargomind.backend.exception;

public class OfferNotFoundException extends RuntimeException {

    public OfferNotFoundException(Long id) {
        super("Offer not found: " + id);
    }
}