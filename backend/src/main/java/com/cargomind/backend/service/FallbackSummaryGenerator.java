package com.cargomind.backend.service;

import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.entity.CargoOffer;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * Template-based summary used when Gemini is unavailable (no API key, timeout, error).
 * Dynamic: the wording depends on the score and on the strongest/weakest factor.
 */
@Component
public class FallbackSummaryGenerator {

    private record Factor(double score, String strength, String weakness) {
    }

    public String generate(CargoOffer offer, ScoreBreakdown b) {
        String route = offer.getOrigin().getName() + " → " + offer.getDestination().getName();

        List<Factor> factors = List.of(
                new Factor(b.routeScore(),
                        "the route ends close to your home base",
                        "the route ends far from your home base"),
                new Factor(b.proximityScore(),
                        "the pickup is right next to your current location",
                        "the empty drive to the pickup is long"),
                new Factor(b.profitScore(),
                        "the rate delivers a high margin",
                        "the margin is low"),
                new Factor(b.deadlineScore(),
                        "the pickup date fits your availability perfectly",
                        "the pickup date requires waiting"));

        Factor best = factors.stream().max(Comparator.comparingDouble(Factor::score)).orElseThrow();
        Factor worst = factors.stream().min(Comparator.comparingDouble(Factor::score)).orElseThrow();

        String first = String.format(Locale.ROOT, "%s is rated %s (%.0f%% match): %s.",
                route, verdict(b.totalScore()), b.totalScore(), best.strength());

        String second = getSecond(b, worst);

        return first + " " + second;
    }

    private static @NonNull String getSecond(ScoreBreakdown b, Factor worst) {
        String profitPart = b.estimatedProfit().signum() >= 0
                ? String.format(Locale.ROOT,
                "Estimated profit is %.2f EUR (%.0f km loaded, %.0f km empty drive)",
                b.estimatedProfit(), b.loadedKm(), b.deadheadKm())
                : String.format(Locale.ROOT,
                "Warning: at this rate the estimated result is %.2f EUR (a loss)",
                b.estimatedProfit());

        return worst.score() >= 80
                ? profitPart + ", with no clear weak points."
                : profitPart + "; weakest point: " + worst.weakness() + ".";
    }

    private static String verdict(double score) {
        if (score >= 80) {
            return "excellent";
        }
        if (score >= 60) {
            return "good";
        }
        if (score >= 40) {
            return "average";
        }
        return "weak";
    }
}