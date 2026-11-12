package com.cargomind.backend.dto;

import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.enums.ContainerType;

import java.math.BigDecimal;
import java.time.LocalDate;

/** REST representation of a stored cargo offer. */
public record CargoOfferDetailsDto(
        Long id,
        String origin,
        String destination,
        ContainerType containerType,
        Integer cargoWeightKg,
        BigDecimal pricePerKm,
        String companyName,
        LocalDate pickupDate
) {

    public static CargoOfferDetailsDto fromEntity(CargoOffer offer) {
        return new CargoOfferDetailsDto(
                offer.getId(),
                offer.getOrigin().getName(),
                offer.getDestination().getName(),
                offer.getContainerType(),
                offer.getCargoWeightKg(),
                offer.getPricePerKm(),
                offer.getCompanyName(),
                offer.getPickupDate());
    }
}