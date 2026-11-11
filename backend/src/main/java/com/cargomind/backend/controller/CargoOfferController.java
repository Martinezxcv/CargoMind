package com.cargomind.backend.controller;

import com.cargomind.backend.dto.CargoOfferResponseDto;
import com.cargomind.backend.dto.CargoSearchRequestDto;
import com.cargomind.backend.service.CargoSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cargo")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CargoOfferController {

    private final CargoSearchService searchService;

    @PostMapping("/search")
    public List<CargoOfferResponseDto> search(@Valid @RequestBody CargoSearchRequestDto request) {
        return searchService.search(request);
    }
}