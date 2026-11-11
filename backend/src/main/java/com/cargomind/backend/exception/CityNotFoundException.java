package com.cargomind.backend.exception;

public class CityNotFoundException extends RuntimeException {

    public CityNotFoundException(String cityName) {
        super("Unknown city: " + cityName);
    }
}