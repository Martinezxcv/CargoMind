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
 * Dynamic: the wording depends on the score and on the strongest/weakest component.
 */
@Component
public class FallbackSummaryGenerator {

    private static final Locale LOCALE = Locale.US;

    private record Component(double score, String strength, String weakness) {
    }

    public String generate(CargoOffer offer, ScoreBreakdown b) {
        String route = offer.getOrigin().getName() + " → " + offer.getDestination().getName();

        List<Component> components = List.of(
                new Component(b.routeScore(),
                        "the route ends close to your home base",
                        "the route ends far from your home base"),
                new Component(b.proximityScore(),
                        "pickup is right next to your current location",
                        "deadhead distance to pickup is long"),
                new Component(b.profitScore(),
                        "the rate yields a high margin",
                        "the margin is low"),
                new Component(b.deadlineScore(),
                        "pickup date perfectly matches your availability",
                        "pickup date requires waiting"));

        Component best = components.stream().max(Comparator.comparingDouble(Component::score)).orElseThrow();
        Component worst = components.stream().min(Comparator.comparingDouble(Component::score)).orElseThrow();

        String first = String.format(LOCALE, "Offer %s is a %s choice (%.0f%% match) – %s.",
                route, verdict(b.totalScore()), b.totalScore(), best.strength());

        String second = getSecond(b, worst);

        return first + " " + second;
    }

    private static @NonNull String getSecond(ScoreBreakdown b, Component worst) {
        String profitPart = b.estimatedProfit().signum() >= 0
                ? String.format(LOCALE, "Estimated profit is %.2f EUR (%.0f km loaded, %.0f km deadhead)",
                b.estimatedProfit(), b.loadedKm(), b.deadheadKm())
                : String.format(LOCALE, "Warning: at this rate the estimated result is %.2f EUR (loss)",
                b.estimatedProfit());

        return worst.score() >= 80
                ? profitPart + ", with no clear weak points."
                : profitPart + ", while the weakest point of this offer is: " + worst.weakness() + ".";
    }

    private static String verdict(double score) {
        if (score >= 80) {
            return "very good";
        }
        if (score >= 60) {
            return "good";
        }
        if (score >= 40) {
            return "average";
        }
        return "poor";
    }
}