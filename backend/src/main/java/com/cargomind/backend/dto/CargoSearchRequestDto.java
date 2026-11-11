package com.cargomind.backend.dto;

import com.cargomind.backend.enums.ContainerType;
import com.cargomind.backend.util.TextNormalizer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

/**
 * REST request: where the carrier is, where it wants to go home, and what vehicle it has.
 * City names are normalized in the compact constructor, before validation runs.
 */
public record CargoSearchRequestDto(
        @NotBlank(message = "currentLocation is required")
        String currentLocation,

        @NotBlank(message = "homeBase is required")
        String homeBase,

        @NotNull(message = "containerType is required")
        ContainerType containerType,

        @NotNull(message = "maxPayloadKg is required")
        @Positive(message = "maxPayloadKg must be greater than 0")
        Integer maxPayloadKg,

        @NotNull(message = "availableFrom is required")
        LocalDate availableFrom
) {

    public CargoSearchRequestDto {
        currentLocation = TextNormalizer.normalizeCityName(currentLocation);
        homeBase = TextNormalizer.normalizeCityName(homeBase);
    }
}