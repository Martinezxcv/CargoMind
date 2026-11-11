package com.cargomind.backend.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ScoringPropertiesTest {

    @Test
    void defaults_areValid() {
        assertThat(ScoringProperties.defaults().weights().route()).isEqualTo(0.30);
    }

    @Test
    void weightsNotSummingToOne_areRejected() {
        ScoringProperties.Thresholds thresholds = ScoringProperties.defaults().thresholds();

        assertThatThrownBy(() -> new ScoringProperties(
                new ScoringProperties.Weights(0.5, 0.5, 0.5, 0.0, 0.0), thresholds, 5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must sum to 1.0");
    }
}