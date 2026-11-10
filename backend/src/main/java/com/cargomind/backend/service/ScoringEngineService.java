package com.cargomind.backend.service;

import com.cargomind.backend.config.ScoringProperties;
import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.dto.SearchCriteria;
import com.cargomind.backend.entity.CargoOffer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

/**
 * Deterministic scoring engine (0-100). The LLM never influences the score,
 * it only explains the result produced here.
 * Weights and thresholds come from {@link ScoringProperties}.
 */
@Service
@RequiredArgsConstructor
public class ScoringEngineService {

    private final GeoService geoService;
    private final ScoringProperties props;

    public ScoreBreakdown score(CargoOffer offer, SearchCriteria criteria) {
        ScoringProperties.Weights w = props.weights();
        ScoringProperties.Thresholds t = props.thresholds();

        double deadheadKm = geoService.roadDistanceKm(criteria.currentLocation(), offer.getOrigin());
        double loadedKm = geoService.roadDistanceKm(offer.getOrigin(), offer.getDestination());
        double homeGapKm = geoService.roadDistanceKm(offer.getDestination(), criteria.homeBase());

        double routeScore = linearDescending(homeGapKm, t.routeZeroAtKm());
        double proximityScore = linearDescending(deadheadKm, t.proximityZeroAtKm());

        // Profit: revenue on the loaded leg minus operating cost of the whole trip (deadhead + loaded)
        double totalKm = deadheadKm + loadedKm;
        double revenue = offer.getPricePerKm().doubleValue() * loadedKm;
        double profit = revenue - t.operatingCostPerKm() * totalKm;
        double marginPerKm = totalKm > 0 ? profit / totalKm : 0;
        double profitScore = clamp(marginPerKm / t.fullMarginPerKm() * 100);

        double vehicleScore = vehicleMatches(offer, criteria) ? 100 : 0;
        double deadlineScore = deadlineScore(offer, criteria, t.deadlinePenaltyPerDay());

        // Vehicle compatibility is a hard requirement: if it fails, the offer is unusable
        double total = vehicleScore == 0 ? 0
                : w.route() * routeScore
                + w.proximity() * proximityScore
                + w.profit() * profitScore
                + w.vehicle() * vehicleScore
                + w.deadline() * deadlineScore;

        return new ScoreBreakdown(
                round1(total),
                round1(routeScore),
                round1(proximityScore),
                round1(profitScore),
                vehicleScore,
                round1(deadlineScore),
                BigDecimal.valueOf(profit).setScale(2, RoundingMode.HALF_UP),
                round1(deadheadKm),
                round1(loadedKm)
        );
    }

    private boolean vehicleMatches(CargoOffer offer, SearchCriteria criteria) {
        return offer.getContainerType() == criteria.containerType()
                && offer.getCargoWeightKg() <= criteria.maxPayloadKg();
    }

    // Pickup before the carrier is available -> impossible (0); each day of waiting costs points
    private double deadlineScore(CargoOffer offer, SearchCriteria criteria, double penaltyPerDay) {
        long waitDays = ChronoUnit.DAYS.between(criteria.availableFrom(), offer.getPickupDate());
        if (waitDays < 0) {
            return 0;
        }
        return clamp(100 - penaltyPerDay * waitDays);
    }

    // 0 -> 100 pts, zeroAt (and beyond) -> 0 pts
    private static double linearDescending(double value, double zeroAt) {
        return clamp(100 * (1 - value / zeroAt));
    }

    private static double clamp(double value) {
        return Math.clamp(value, 0, 100);
    }

    private static double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}