
package com.fundex.repository;

import com.fundex.entity.HistoricalPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HistoricalPriceRepository
        extends JpaRepository<HistoricalPrice, Long> {

    List<HistoricalPrice> findByStockIdAndPriceDateBetweenOrderByPriceDateAsc(
            Long stockId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<HistoricalPrice> findByStockIdOrderByPriceDateAsc(Long stockId);

    boolean existsByStockId(Long stockId);

    Optional<HistoricalPrice> findTopByStockIdOrderByPriceDateDesc(Long stockId);
}
