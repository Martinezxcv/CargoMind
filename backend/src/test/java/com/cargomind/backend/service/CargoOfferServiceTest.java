package com.cargomind.backend.service;

import com.cargomind.backend.dto.CargoOfferDetailsDto;
import com.cargomind.backend.dto.CargoOfferRequestDto;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import com.cargomind.backend.enums.ContainerType;
import com.cargomind.backend.exception.CityNotFoundException;
import com.cargomind.backend.exception.InvalidOfferException;
import com.cargomind.backend.exception.OfferNotFoundException;
import com.cargomind.backend.repository.CargoOfferRepository;
import com.cargomind.backend.repository.CityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CargoOfferServiceTest {

    private final CargoOfferRepository offerRepository = mock(CargoOfferRepository.class);
    private final CityRepository cityRepository = mock(CityRepository.class);
    private final CargoOfferService service = new CargoOfferService(offerRepository, cityRepository);

    private final City berlin = City.builder().name("BERLIN").countryCode("DE").build();
    private final City warsaw = City.builder().name("WARSZAWA").countryCode("PL").build();

    @BeforeEach
    void setUp() {
        when(cityRepository.findByName("BERLIN")).thenReturn(Optional.of(berlin));
        when(cityRepository.findByName("WARSZAWA")).thenReturn(Optional.of(warsaw));
        when(offerRepository.save(any(CargoOffer.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void create_resolvesCitiesAndSavesOffer() {
        CargoOfferDetailsDto result = service.create(request("Berlin", "Warszawa"));

        assertThat(result.origin()).isEqualTo("BERLIN");
        assertThat(result.destination()).isEqualTo("WARSZAWA");
        assertThat(result.companyName()).isEqualTo("Acme"); // trimmed
        verify(offerRepository).save(any(CargoOffer.class));
    }

    @Test
    void create_sameOriginAndDestination_isRejected() {
        assertThatThrownBy(() -> service.create(request("Berlin", "berlin")))
                .isInstanceOf(InvalidOfferException.class);
        verify(offerRepository, never()).save(any());
    }

    @Test
    void create_unknownCity_isRejected() {
        assertThatThrownBy(() -> service.create(request("Atlantyda", "Warszawa")))
                .isInstanceOf(CityNotFoundException.class);
    }

    @Test
    void update_changesAllFields() {
        CargoOffer existing = CargoOffer.builder().origin(warsaw).destination(berlin).build();
        when(offerRepository.findById(7L)).thenReturn(Optional.of(existing));

        CargoOfferDetailsDto result = service.update(7L, request("Berlin", "Warszawa"));

        assertThat(result.origin()).isEqualTo("BERLIN");
        assertThat(existing.getPricePerKm()).isEqualByComparingTo("1.40");
    }

    @Test
    void update_missingOffer_throwsNotFound() {
        when(offerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, request("Berlin", "Warszawa")))
                .isInstanceOf(OfferNotFoundException.class);
    }

    @Test
    void delete_missingOffer_throwsNotFound() {
        when(offerRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L)).isInstanceOf(OfferNotFoundException.class);
        verify(offerRepository, never()).deleteById(any());
    }

    @Test
    void delete_existingOffer_deletesIt() {
        when(offerRepository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(offerRepository).deleteById(1L);
    }

    private static CargoOfferRequestDto request(String origin, String destination) {
        return new CargoOfferRequestDto(origin, destination, ContainerType.TRUCK_24T, 18_000,
                new BigDecimal("1.40"), "  Acme  ", LocalDate.now().plusDays(1));
    }
}