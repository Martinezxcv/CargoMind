package com.cargomind.backend.dto;

import com.cargomind.backend.enums.ContainerType;
import com.cargomind.backend.util.TextNormalizer;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * REST request for creating or updating a cargo offer.
 */
public record CargoOfferRequestDto(
        @NotBlank(message = "origin is required")
        String origin,

        @NotBlank(message = "destination is required")
        String destination,

        @NotNull(message = "containerType is required")
        ContainerType containerType,

        @NotNull(message = "cargoWeightKg is required")
        @Positive(message = "cargoWeightKg must be greater than 0")
        @Max(value = 100_000, message = "cargoWeightKg must not exceed 100000")
        Integer cargoWeightKg,

        @NotNull(message = "pricePerKm is required")
        @DecimalMin(value = "0.01", message = "pricePerKm must be at least 0.01")
        @DecimalMax(value = "999.99", message = "pricePerKm must not exceed 999.99")
        @Digits(integer = 3, fraction = 2, message = "pricePerKm allows at most 2 decimal places")
        BigDecimal pricePerKm,

        @NotBlank(message = "companyName is required")
        @Size(max = 100, message = "companyName must not exceed 100 characters")
        String companyName,

        @NotNull(message = "pickupDate is required")
        @FutureOrPresent(message = "pickupDate must not be in the past")
        LocalDate pickupDate
) {

    public CargoOfferRequestDto {
        origin = TextNormalizer.normalizeCityName(origin);
        destination = TextNormalizer.normalizeCityName(destination);
        companyName = companyName == null ? null : companyName.trim();
    }
}