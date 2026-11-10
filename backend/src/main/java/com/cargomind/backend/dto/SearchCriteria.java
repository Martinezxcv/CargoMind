package com.cargomind.backend.dto;

import com.cargomind.backend.entity.City;
import com.cargomind.backend.enums.ContainerType;

import java.time.LocalDate;

/**
 * Internal (resolved) search criteria passed to the scoring engine.
 * Unlike the REST request DTO, it already contains City entities instead of raw names.
 */
public record SearchCriteria(
        City currentLocation,
        City homeBase,
        ContainerType containerType,
        int maxPayloadKg,
        LocalDate availableFrom
) {
}