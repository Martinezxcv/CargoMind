package com.cargomind.backend.repository;

import com.cargomind.backend.entity.CargoOffer;
import com.cargomind.backend.enums.ContainerType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CargoOfferRepository extends JpaRepository<CargoOffer, Long> {

    // Fetch cities eagerly in one query - scoring needs coordinates for every offer (avoids N+1)
    @EntityGraph(attributePaths = {"origin", "destination"})
    List<CargoOffer> findByContainerType(ContainerType containerType);

    @EntityGraph(attributePaths = {"origin", "destination"})
    List<CargoOffer> findAll();
}