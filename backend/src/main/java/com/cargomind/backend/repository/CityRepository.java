package com.cargomind.backend.repository;

import com.cargomind.backend.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {

    // Lookup by normalized (UPPERCASE) name
    Optional<City> findByName(String name);
}