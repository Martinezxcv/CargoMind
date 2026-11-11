package com.cargomind.backend.dto;

import com.cargomind.backend.entity.City;

/** REST representation of a city (value for dropdowns). */
public record CityDto(String name, String countryCode) {

    public static CityDto fromEntity(City city) {
        return new CityDto(city.getName(), city.getCountryCode());
    }
}