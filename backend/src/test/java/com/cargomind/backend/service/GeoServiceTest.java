package com.cargomind.backend.service;

import com.cargomind.backend.entity.City;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class GeoServiceTest {

    private final GeoService geoService = new GeoService();

    @Test
    void haversine_warsawToKrakow_isAbout252Km() {
        double km = geoService.haversineKm(52.2297, 21.0122, 50.0647, 19.9450);
        assertThat(km).isCloseTo(252, within(5.0));
    }

    @Test
    void haversine_warsawToBerlin_isAbout516Km() {
        double km = geoService.haversineKm(52.2297, 21.0122, 52.5200, 13.4050);
        assertThat(km).isCloseTo(516, within(8.0));
    }

    @Test
    void roadDistance_appliesRoadFactor() {
        City warsaw = City.builder().name("WARSZAWA").countryCode("PL").latitude(52.2297).longitude(21.0122).build();
        City krakow = City.builder().name("KRAKOW").countryCode("PL").latitude(50.0647).longitude(19.9450).build();

        double straight = geoService.haversineKm(52.2297, 21.0122, 50.0647, 19.9450);

        assertThat(geoService.roadDistanceKm(warsaw, krakow))
                .isCloseTo(straight * GeoService.ROAD_FACTOR, within(0.001));
    }

    @Test
    void distance_toSameCity_isZero() {
        assertThat(geoService.haversineKm(52.2297, 21.0122, 52.2297, 21.0122)).isZero();
    }
}