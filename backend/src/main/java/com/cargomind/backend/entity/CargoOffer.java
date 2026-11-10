package com.cargomind.backend.entity;

import com.cargomind.backend.enums.ContainerType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * JPA entity representing a cargo (freight) offer that a carrier can pick up.
 * Never exposed directly through the REST API - use DTOs.
 *
 * <p>Lombok's @Data is intentionally avoided: it generates equals/hashCode/toString
 * over all fields, which is unsafe for JPA entities (proxies, lazy relations, mutable ids).
 */
@Entity
@Table(name = "cargo_offers")
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true) // lazy relations must not be touched by toString
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // required by JPA
@AllArgsConstructor(access = AccessLevel.PRIVATE)  // used by the builder
public class CargoOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "origin_city_id", nullable = false)
    private City origin;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_city_id", nullable = false)
    private City destination;

    @Enumerated(EnumType.STRING) // never ORDINAL - it breaks when enum order changes
    @Column(name = "container_type", nullable = false)
    @ToString.Include
    private ContainerType containerType;

    // Weight of the cargo to be transported (must fit the carrier's vehicle payload)
    @Column(name = "cargo_weight_kg", nullable = false)
    @ToString.Include
    private Integer cargoWeightKg;

    // BigDecimal for monetary values - avoids floating point errors
    @Column(name = "price_per_km", nullable = false, precision = 10, scale = 2)
    @ToString.Include
    private BigDecimal pricePerKm;

    @Column(name = "company_name", nullable = false)
    @ToString.Include
    private String companyName;

    // Earliest date the cargo can be picked up
    @Column(name = "pickup_date", nullable = false)
    @ToString.Include
    private LocalDate pickupDate;

    // Identity based on the database id only (transient entities are never equal)
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CargoOffer other)) {
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