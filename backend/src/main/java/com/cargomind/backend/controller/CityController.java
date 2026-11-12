package com.cargomind.backend.controller;

import com.cargomind.backend.dto.CityDto;
import com.cargomind.backend.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityRepository cityRepository;

    @GetMapping
    public List<CityDto> list() {
        return cityRepository.findAllByOrderByNameAsc().stream()
                .map(CityDto::fromEntity)
                .toList();
    }
}