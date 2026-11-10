package com.cargomind.backend.dto;

import java.math.BigDecimal;

/**
 * Result of scoring a single offer. Component scores are 0-100.
 * Also serves as the structured input for the AI summary (Gemini / fallback).
 */
public record ScoreBreakdown(
        double totalScore,
        double routeScore,
        double proximityScore,
        double profitScore,
        double vehicleScore,
        double deadlineScore,
        BigDecimal estimatedProfit,
        double deadheadKm,
        double loadedKm
) {
}