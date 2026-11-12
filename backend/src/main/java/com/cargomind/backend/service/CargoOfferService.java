package com.cargomind.backend.service;

import com.cargomind.backend.dto.CargoOfferDetailsDto;
import com.cargomind.backend.dto.CargoOfferRequestDto;
import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.entity.City;
import com.cargomind.backend.exception.CityNotFoundException;
import com.cargomind.backend.exception.InvalidOfferException;
import com.cargomind.backend.exception.OfferNotFoundException;
import com.cargomind.backend.repository.CargoOfferRepository;
import com.cargomind.backend.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD for cargo offers. Entities never leave this class - callers get DTOs.
 */
@Service
@RequiredArgsConstructor
public class CargoOfferService {

    private final CargoOfferRepository offerRepository;
    private final CityRepository cityRepository;

    @Transactional(readOnly = true)
    public List<CargoOfferDetailsDto> findAll() {
        return offerRepository.findAllByOrderByPickupDateAscIdAsc().stream()
                .map(CargoOfferDetailsDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public CargoOfferDetailsDto get(Long id) {
        return CargoOfferDetailsDto.fromEntity(findOrThrow(id));
    }

    @Transactional
    public CargoOfferDetailsDto create(CargoOfferRequestDto request) {
        CargoOffer offer = CargoOffer.builder().build();
        apply(offer, request);
        return CargoOfferDetailsDto.fromEntity(offerRepository.save(offer));
    }

    @Transactional
    public CargoOfferDetailsDto update(Long id, CargoOfferRequestDto request) {
        CargoOffer offer = findOrThrow(id);
        apply(offer, request); // managed entity: changes are flushed on commit
        return CargoOfferDetailsDto.fromEntity(offer);
    }

    @Transactional
    public void delete(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new OfferNotFoundException(id);
        }
        offerRepository.deleteById(id);
    }

    private CargoOffer findOrThrow(Long id) {
        return offerRepository.findById(id).orElseThrow(() -> new OfferNotFoundException(id));
    }

    private void apply(CargoOffer offer, CargoOfferRequestDto request) {
        if (request.origin().equals(request.destination())) {
            throw new InvalidOfferException("Origin and destination must be different cities");
        }
        offer.setOrigin(findCity(request.origin()));
        offer.setDestination(findCity(request.destination()));
        offer.setContainerType(request.containerType());
        offer.setCargoWeightKg(request.cargoWeightKg());
        offer.setPricePerKm(request.pricePerKm());
        offer.setCompanyName(request.companyName());
        offer.setPickupDate(request.pickupDate());
    }

    private City findCity(String normalizedName) {
        return cityRepository.findByName(normalizedName)
                .orElseThrow(() -> new CityNotFoundException(normalizedName));
    }
}