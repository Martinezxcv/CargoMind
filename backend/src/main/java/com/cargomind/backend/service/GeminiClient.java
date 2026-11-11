package com.cargomind.backend.service;

import com.cargomind.backend.config.GeminiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

/**
 * Thin HTTP client for the Gemini REST API. Throws on transport/HTTP errors;
 * the caller ({@link AiSummaryService}) decides how to fall back.
 */
@Slf4j
@Component
public class GeminiClient {

    private final GeminiProperties props;
    private final RestClient restClient;

    public GeminiClient(GeminiProperties props) {
        this.props = props;

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(props.timeoutSeconds()));

        this.restClient = RestClient.builder()
                .baseUrl(props.url())
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isEnabled() {
        return props.isEnabled();
    }

    public Optional<String> generate(String systemInstruction, String userPrompt) {
        GeminiApi.Request body = new GeminiApi.Request(
                new GeminiApi.Content(List.of(new GeminiApi.Part(systemInstruction))),
                List.of(new GeminiApi.Content(List.of(new GeminiApi.Part(userPrompt)))),
                new GeminiApi.GenerationConfig(0.4, 512));

        GeminiApi.Response response = restClient.post()
                .uri("/{model}:generateContent", props.model())
                .header("x-goog-api-key", props.key())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(GeminiApi.Response.class);

        return Optional.ofNullable(response)
                .map(GeminiApi.Response::firstText)
                .filter(text -> !text.isBlank());
    }
}