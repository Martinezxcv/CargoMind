package com.cargomind.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Reference data: a city with geographic coordinates.
 * Used by GeoService to calculate distances (Haversine) without any external API.
 */
@Entity
@Table(name = "cities")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // required by JPA
@AllArgsConstructor(access = AccessLevel.PRIVATE)  // used by the builder
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique UPPERCASE name without diacritics, e.g. "WARSZAWA" (lookup key)
    @Column(nullable = false, unique = true)
    private String name;

    // ISO 3166-1 alpha-2, e.g. "PL", "DE"
    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // Identity based on the database id only
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof City other)) {
            return false;
        }
        return id != null && id.equals(other.getId());
    }

    // Constant hash code keeps the hash stable before and after the id is assigned
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}