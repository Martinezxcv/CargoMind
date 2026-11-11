package com.cargomind.backend.dto;

import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.enums.ContainerType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * REST response: one scored offer with the AI (or fallback) summary.
 */
public record CargoOfferResponseDto(
        Long id,
        String origin,
        String destination,
        ContainerType containerType,
        Integer cargoWeightKg,
        BigDecimal pricePerKm,
        String companyName,
        LocalDate pickupDate,
        ScoreBreakdown scoreBreakdown,
        String aiSummary
) {

    public static CargoOfferResponseDto of(CargoOffer offer, ScoreBreakdown breakdown, String aiSummary) {
        return new CargoOfferResponseDto(
                offer.getId(),
                offer.getOrigin().getName(),
                offer.getDestination().getName(),
                offer.getContainerType(),
                offer.getCargoWeightKg(),
                offer.getPricePerKm(),
                offer.getCompanyName(),
                offer.getPickupDate(),
                breakdown,
                aiSummary
        );
    }
}