package com.cargomind.backend.service;

import com.cargomind.backend.config.ScoringProperties;
import com.cargomind.backend.dto.CargoOfferResponseDto;
import com.cargomind.backend.dto.CargoSearchRequestDto;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import com.cargomind.backend.enums.ContainerType;
import com.cargomind.backend.exception.CityNotFoundException;
import com.cargomind.backend.repository.CargoOfferRepository;
import com.cargomind.backend.repository.CityRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CargoSearchServiceTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 11, 10);

    private final City berlin = city("BERLIN", 52.5200, 13.4050);
    private final City warsaw = city("WARSZAWA", 52.2297, 21.0122);
    private final City munich = city("MONACHIUM", 48.1351, 11.5820);

    private final CityRepository cityRepository = mock(CityRepository.class);
    private final CargoOfferRepository offerRepository = mock(CargoOfferRepository.class);
    private final AiSummaryService aiSummary = mock(AiSummaryService.class);

    private CargoSearchService service() {
        ScoringProperties defaults = ScoringProperties.defaults();
        ScoringProperties props = new ScoringProperties(defaults.weights(), defaults.thresholds(), 5);

        when(cityRepository.findByName("BERLIN")).thenReturn(Optional.of(berlin));
        when(cityRepository.findByName("WARSZAWA")).thenReturn(Optional.of(warsaw));
        when(aiSummary.summarize(any(), any())).thenReturn("summary");

        return new CargoSearchService(cityRepository, offerRepository,
                new ScoringEngineService(new GeoService(), props), aiSummary, props,
                Executors.newVirtualThreadPerTaskExecutor());
    }

    private CargoSearchRequestDto request() {
        return new CargoSearchRequestDto("Berlin", "Warszawa", ContainerType.TRUCK_24T, 24_000, TODAY);
    }

    @Test
    void returnsAtMostMaxResults_sortedByScoreDescending() {
        List<CargoOffer> offers = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            offers.add(offer(berlin, warsaw, "1." + (20 + i)));
        }
        offers.add(offer(berlin, munich, "1.20")); // ends far from home -> lower score
        when(offerRepository.findByContainerType(ContainerType.TRUCK_24T)).thenReturn(offers);

        List<CargoOfferResponseDto> result = service().search(request());

        assertThat(result).hasSize(5);
        assertThat(result).extracting(r -> r.scoreBreakdown().totalScore())
                .isSortedAccordingTo(java.util.Comparator.reverseOrder());
    }

    @Test
    void offersWithZeroScore_areExcluded() {
        CargoOffer tooHeavy = offer(berlin, warsaw, "1.50", 30_000);
        when(offerRepository.findByContainerType(ContainerType.TRUCK_24T)).thenReturn(List.of(tooHeavy));

        assertThat(service().search(request())).isEmpty();
    }

    @Test
    void unknownCity_throwsCityNotFound() {
        CargoSearchService service = service();
        when(cityRepository.findByName("ATLANTYDA")).thenReturn(Optional.empty());

        CargoSearchRequestDto bad =
                new CargoSearchRequestDto("Atlantyda", "Warszawa", ContainerType.TRUCK_24T, 24_000, TODAY);

        assertThatThrownBy(() -> service.search(bad)).isInstanceOf(CityNotFoundException.class);
    }

    // ---------- helpers ----------

    private static City city(String name, double lat, double lon) {
        return City.builder().name(name).countryCode("XX").latitude(lat).longitude(lon).build();
    }

    private static CargoOffer offer(City from, City to, String price) {
        return offer(from, to, price, 18_000);
    }

    private static CargoOffer offer(City from, City to, String price, int weightKg) {
        return CargoOffer.builder().origin(from).destination(to)
                .containerType(ContainerType.TRUCK_24T).cargoWeightKg(weightKg)
                .pricePerKm(new BigDecimal(price)).companyName("Test Co").pickupDate(TODAY).build();
    }
}