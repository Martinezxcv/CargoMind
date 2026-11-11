package com.cargomind.backend.service;

import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AiSummaryServiceTest {

    private final GeminiClient client = mock(GeminiClient.class);
    private final AiSummaryService service = new AiSummaryService(client, new FallbackSummaryGenerator());

    private final CargoOffer offer = CargoOffer.builder()
            .origin(City.builder().name("BERLIN").build())
            .destination(City.builder().name("WARSZAWA").build())
            .build();
    private final ScoreBreakdown breakdown =
            new ScoreBreakdown(80, 100, 100, 60, 100, 100, new BigDecimal("300.00"), 0, 574);

    @Test
    void noApiKey_usesFallbackWithoutCallingGemini() {
        when(client.isEnabled()).thenReturn(false);

        String result = service.summarize(offer, breakdown);

        assertThat(result).contains("BERLIN → WARSZAWA");
        verify(client, never()).generate(anyString(), anyString());
    }

    @Test
    void geminiAnswer_isReturnedAsIs() {
        when(client.isEnabled()).thenReturn(true);
        when(client.generate(anyString(), anyString())).thenReturn(Optional.of("Gemini says hi."));

        assertThat(service.summarize(offer, breakdown)).isEqualTo("Gemini says hi.");
    }

    @Test
    void geminiFailure_fallsBackInsteadOfThrowing() {
        when(client.isEnabled()).thenReturn(true);
        when(client.generate(anyString(), anyString())).thenThrow(new RuntimeException("timeout"));

        assertThat(service.summarize(offer, breakdown)).contains("BERLIN → WARSZAWA");
    }
}