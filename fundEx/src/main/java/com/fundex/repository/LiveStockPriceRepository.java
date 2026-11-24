package com.fundex.repository;

import com.fundex.entity.LiveStockPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LiveStockPriceRepository
        extends JpaRepository<LiveStockPrice, Long> {

    Optional<LiveStockPrice> findByStockId(Long stockId);

    boolean existsByStockId(Long stockId);
}