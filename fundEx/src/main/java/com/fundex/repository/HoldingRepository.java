package com.fundex.repository;

import com.fundex.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    Optional<Holding> findByUserIdAndStockId(
            Long userId,
            Long stockId
    );

    List<Holding> findByUserId(Long userId);
}