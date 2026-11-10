package com.cargomind.backend.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Typed, validated scoring configuration bound from the "scoring" prefix.
 * An invalid configuration fails fast at application startup.
 */
@Validated
@ConfigurationProperties(prefix = "scoring")
public record ScoringProperties(
        @NotNull @Valid Weights weights,
        @NotNull @Valid Thresholds thresholds
) {

    private static final double WEIGHT_SUM_TOLERANCE = 0.0001;

    // Cross-field rule: weights must add up to exactly 100%
    public ScoringProperties {
        if (weights != null) {
            double sum = weights.route() + weights.proximity() + weights.profit()
                    + weights.vehicle() + weights.deadline();
            if (Math.abs(sum - 1.0) > WEIGHT_SUM_TOLERANCE) {
                throw new IllegalArgumentException(
                        "scoring.weights must sum to 1.0 but sum to " + sum);
            }
        }
    }

    public record Weights(
            @DecimalMin("0.0") @DecimalMax("1.0") double route,
            @DecimalMin("0.0") @DecimalMax("1.0") double proximity,
            @DecimalMin("0.0") @DecimalMax("1.0") double profit,
            @DecimalMin("0.0") @DecimalMax("1.0") double vehicle,
            @DecimalMin("0.0") @DecimalMax("1.0") double deadline
    ) {
    }

    public record Thresholds(
            @Positive double routeZeroAtKm,
            @Positive double proximityZeroAtKm,
            @Positive double operatingCostPerKm,
            @Positive double fullMarginPerKm,
            @Positive double deadlinePenaltyPerDay
    ) {
    }

    /** Same values as application.yml. Handy for unit tests that do not start Spring. */
    public static ScoringProperties defaults() {
        return new ScoringProperties(
                new Weights(0.30, 0.20, 0.30, 0.15, 0.05),
                new Thresholds(500.0, 300.0, 1.00, 0.60, 25.0));
    }
}