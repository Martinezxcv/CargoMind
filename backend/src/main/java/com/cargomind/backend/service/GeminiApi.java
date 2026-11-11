package com.cargomind.backend.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Minimal request/response models of the Gemini generateContent endpoint.
 * Only the fields we actually use are declared.
 */
final class GeminiApi {

    private GeminiApi() {
    }

    record Request(Content systemInstruction, List<Content> contents, GenerationConfig generationConfig) {
    }

    record Content(List<Part> parts) {
    }

    record Part(String text) {
    }

    record GenerationConfig(double temperature, int maxOutputTokens) {
    }

    record Response(List<Candidate> candidates) {

        /** Text of the first candidate, or null when the response has no usable text. */
        String firstText() {
            if (candidates == null || candidates.isEmpty()) {
                return null;
            }
            Content content = candidates.getFirst().content();
            if (content == null || content.parts() == null) {
                return null;
            }
            return content.parts().stream()
                    .map(Part::text)
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining(" "))
                    .trim();
        }
    }

    record Candidate(Content content) {
    }
}