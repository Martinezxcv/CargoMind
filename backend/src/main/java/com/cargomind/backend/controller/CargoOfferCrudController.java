package com.cargomind.backend.controller;

import com.cargomind.backend.dto.CargoOfferDetailsDto;
import com.cargomind.backend.dto.CargoOfferRequestDto;
import com.cargomind.backend.service.CargoOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class CargoOfferCrudController {

    private final CargoOfferService offerService;

    @GetMapping
    public List<CargoOfferDetailsDto> list() {
        return offerService.findAll();
    }

    @GetMapping("/{id}")
    public CargoOfferDetailsDto get(@PathVariable Long id) {
        return offerService.get(id);
    }

    @PostMapping
    public ResponseEntity<CargoOfferDetailsDto> create(@Valid @RequestBody CargoOfferRequestDto request) {
        CargoOfferDetailsDto created = offerService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public CargoOfferDetailsDto update(@PathVariable Long id,
                                       @Valid @RequestBody CargoOfferRequestDto request) {
        return offerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        offerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}