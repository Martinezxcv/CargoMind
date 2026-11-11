package com.cargomind.backend.service;

import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class FallbackSummaryGeneratorTest {

    private final FallbackSummaryGenerator generator = new FallbackSummaryGenerator();

    @Test
    void highScore_mentionsRouteVerdictAndProfit() {
        String text = generator.generate(offer(), breakdown(92.0, "430.00"));

        assertThat(text).contains("BERLIN → WARSZAWA", "excellent", "92%", "430");
    }

    @Test
    void negativeProfit_isFlaggedAsLoss() {
        String text = generator.generate(offer(), breakdown(35.0, "-120.00"));

        assertThat(text).contains("weak", "loss");
    }

    @Test
    void producesExactlyTwoSentences() {
        String text = generator.generate(offer(), breakdown(70.0, "200.00"));

        assertThat(text.split("(?<=[.])\\s+")).hasSize(2);
    }

    private static CargoOffer offer() {
        return CargoOffer.builder()
                .origin(City.builder().name("BERLIN").build())
                .destination(City.builder().name("WARSZAWA").build())
                .build();
    }

    private static ScoreBreakdown breakdown(double total, String profit) {
        return new ScoreBreakdown(total, 100, 100, 60, 100, 100, new BigDecimal(profit), 0, 574);
    }
}