package com.fundex.repository;

import com.fundex.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository
        extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findByUserId(Long userId);

    Optional<Watchlist> findByUserIdAndStockId(
            Long userId,
            Long stockId
    );

    boolean existsByUserIdAndStockId(
            Long userId,
            Long stockId
    );
}