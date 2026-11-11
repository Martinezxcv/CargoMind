package com.cargomind.backend.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

/**
 * Gemini REST API settings. An empty key is valid and means "fallback mode".
 */
@Validated
@ConfigurationProperties(prefix = "gemini.api")
public record GeminiProperties(
        String key,
        @NotBlank String url,
        @NotBlank String model,
        @Positive @DefaultValue("8") int timeoutSeconds
) {

    public boolean isEnabled() {
        return key != null && !key.isBlank();
    }
}