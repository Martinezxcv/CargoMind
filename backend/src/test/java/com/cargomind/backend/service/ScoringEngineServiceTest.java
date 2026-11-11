package com.cargomind.backend.service;

import com.cargomind.backend.config.ScoringProperties;
import com.cargomind.backend.dto.ScoreBreakdown;
import com.cargomind.backend.dto.SearchCriteria;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import com.cargomind.backend.enums.ContainerType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class ScoringEngineServiceTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 11, 10);

    private final ScoringEngineService engine =
            new ScoringEngineService(new GeoService(), ScoringProperties.defaults());

    private final City warsaw = city("WARSZAWA", 52.2297, 21.0122);
    private final City berlin = city("BERLIN", 52.5200, 13.4050);
    private final City dresden = city("DRESDEN", 51.0504, 13.7373);
    private final City poznan = city("POZNAN", 52.4064, 16.9252);

    // Carrier stands in Berlin, wants to go home to Warsaw, has a 24t truck (24 000 kg)
    private SearchCriteria criteria() {
        return new SearchCriteria(berlin, warsaw, ContainerType.TRUCK_24T, 24_000, TODAY);
    }

    @Test
    void idealReturnOffer_scoresHigh() {
        // BERLIN -> WARSZAWA: no deadhead, ends at home, pickup today, margin 0.45 EUR/km (= 75 pts)
        CargoOffer offer = offer(berlin, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);

        ScoreBreakdown result = engine.score(offer, criteria());

        // 0.30*100 + 0.20*100 + 0.30*75 + 0.15*100 + 0.05*100 = 92.5
        assertThat(result.totalScore()).isCloseTo(92.5, within(0.1));
        assertThat(result.routeScore()).isEqualTo(100);
        assertThat(result.proximityScore()).isEqualTo(100);
        assertThat(result.estimatedProfit()).isPositive();
    }

    @Test
    void wrongContainerType_givesZeroTotal() {
        CargoOffer offer = offer(berlin, warsaw, ContainerType.REEFER_24T, 18_000, "1.95", TODAY);

        assertThat(engine.score(offer, criteria()).totalScore()).isZero();
    }

    @Test
    void cargoHeavierThanPayload_givesZeroTotal() {
        CargoOffer offer = offer(berlin, warsaw, ContainerType.TRUCK_24T, 25_000, "1.95", TODAY);

        assertThat(engine.score(offer, criteria()).totalScore()).isZero();
    }

    @Test
    void pickupBeforeAvailability_zeroesDeadlineComponentOnly() {
        CargoOffer offer = offer(berlin, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY.minusDays(1));

        ScoreBreakdown result = engine.score(offer, criteria());

        assertThat(result.deadlineScore()).isZero();
        assertThat(result.totalScore()).isCloseTo(87.5, within(0.1)); // 92.5 - 5
    }

    @Test
    void closerPickup_scoresHigherThanFarPickup() {
        CargoOffer near = offer(berlin, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);
        CargoOffer far = offer(dresden, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);

        assertThat(engine.score(near, criteria()).totalScore())
                .isGreaterThan(engine.score(far, criteria()).totalScore());
    }

    @Test
    void offerEndingFarFromHome_getsLowerRouteScore() {
        CargoOffer home = offer(berlin, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);
        CargoOffer away = offer(berlin, dresden, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);

        assertThat(engine.score(home, criteria()).routeScore())
                .isGreaterThan(engine.score(away, criteria()).routeScore());
    }

    @Test
    void priceBelowOperatingCost_givesZeroProfitScore() {
        CargoOffer offer = offer(berlin, poznan, ContainerType.TRUCK_24T, 18_000, "0.80", TODAY);

        ScoreBreakdown result = engine.score(offer, criteria());

        assertThat(result.profitScore()).isZero();
        assertThat(result.estimatedProfit()).isNegative();
    }

    @Test
    void customWeights_changeTheResult() {
        ScoringProperties onlyDeadline = new ScoringProperties(
                new ScoringProperties.Weights(0, 0, 0, 0, 1.0),
                ScoringProperties.defaults().thresholds(),
                5);
        ScoringEngineService custom = new ScoringEngineService(new GeoService(), onlyDeadline);

        CargoOffer offer = offer(berlin, warsaw, ContainerType.TRUCK_24T, 18_000, "1.45", TODAY);

        // Pickup today -> deadline score 100, and it is the only weighted component
        assertThat(custom.score(offer, criteria()).totalScore()).isEqualTo(100.0);
    }

    // ---------- helpers ----------

    private static City city(String name, double lat, double lon) {
        return City.builder().name(name).countryCode("XX").latitude(lat).longitude(lon).build();
    }

    private static CargoOffer offer(City origin, City destination, ContainerType type,
                                    int weightKg, String pricePerKm, LocalDate pickupDate) {
        return CargoOffer.builder()
                .origin(origin)
                .destination(destination)
                .containerType(type)
                .cargoWeightKg(weightKg)
                .pricePerKm(new BigDecimal(pricePerKm))
                .companyName("Test Co")
                .pickupDate(pickupDate)
                .build();
    }
}