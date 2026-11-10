package com.cargomind.backend.service;

import com.cargomind.backend.entity.City;
import org.springframework.stereotype.Service;

/**
 * Offline distance calculation (Haversine formula), no external API required.
 */
@Service
public class GeoService {

    private static final double EARTH_RADIUS_KM = 6371.0088;

    // Roads are longer than the great-circle line; 1.2 is a common rule of thumb for Europe
    static final double ROAD_FACTOR = 1.2;

    /** Estimated driving distance between two cities in kilometers. */
    public double roadDistanceKm(City from, City to) {
        return haversineKm(from.getLatitude(), from.getLongitude(),
                to.getLatitude(), to.getLongitude()) * ROAD_FACTOR;
    }

    /** Great-circle distance in kilometers. Package-private for testing. */
    double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}