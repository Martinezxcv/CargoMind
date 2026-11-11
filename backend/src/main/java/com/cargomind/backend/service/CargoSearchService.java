package com.cargomind.backend.service;

import com.cargomind.backend.config.ScoringProperties;
import com.cargomind.backend.dto.CargoOfferResponseDto;
import com.cargomind.backend.dto.CargoSearchRequestDto;
import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.dto.SearchCriteria;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import com.cargomind.backend.exception.CityNotFoundException;
import com.cargomind.backend.repository.CargoOfferRepository;
import com.cargomind.backend.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

/**
 * Orchestrates a search: resolve cities -> score offers -> keep the best N -> add summaries.
 * Intentionally NOT @Transactional: no DB transaction should stay open during Gemini HTTP calls
 * (cities are fetched together with offers by the repository's entity graph).
 */
@Service
@RequiredArgsConstructor
public class CargoSearchService {

    private record ScoredOffer(CargoOffer offer, ScoreBreakdown breakdown) {
    }

    // Best score first; ties broken by higher estimated profit
    private static final Comparator<ScoredOffer> BEST_FIRST =
            Comparator.comparingDouble((ScoredOffer s) -> s.breakdown().totalScore())
                    .thenComparing((ScoredOffer s) -> s.breakdown().estimatedProfit())
                    .reversed();

    private final CityRepository cityRepository;
    private final CargoOfferRepository offerRepository;
    private final ScoringEngineService scoringEngine;
    private final AiSummaryService aiSummaryService;
    private final ScoringProperties props;
    private final ExecutorService summaryExecutor;

    public List<CargoOfferResponseDto> search(CargoSearchRequestDto request) {
        SearchCriteria criteria = toCriteria(request);

        // Offers with another container type would score 0 anyway - skip them in the query
        List<ScoredOffer> best = offerRepository.findByContainerType(criteria.containerType()).stream()
                .map(offer -> new ScoredOffer(offer, scoringEngine.score(offer, criteria)))
                .filter(scored -> scored.breakdown().totalScore() > 0)
                .sorted(BEST_FIRST)
                .limit(props.maxResults())
                .toList();

        // One summary per offer, generated in parallel (summarize() never throws)
        List<CompletableFuture<CargoOfferResponseDto>> futures = best.stream()
                .map(scored -> CompletableFuture.supplyAsync(
                        () -> CargoOfferResponseDto.of(
                                scored.offer(),
                                scored.breakdown(),
                                aiSummaryService.summarize(scored.offer(), scored.breakdown())),
                        summaryExecutor))
                .toList();

        return futures.stream().map(CompletableFuture::join).toList();
    }

    private SearchCriteria toCriteria(CargoSearchRequestDto request) {
        return new SearchCriteria(
                findCity(request.currentLocation()),
                findCity(request.homeBase()),
                request.containerType(),
                request.maxPayloadKg(),
                request.availableFrom());
    }

    private City findCity(String normalizedName) {
        return cityRepository.findByName(normalizedName)
                .orElseThrow(() -> new CityNotFoundException(normalizedName));
    }
}