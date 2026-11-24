package com.fundex.controller;

import com.fundex.dto.WatchlistResponse;
import com.fundex.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    // Add stock to watchlist
    @PostMapping("/{symbol}")
    public ResponseEntity<String> addToWatchlist(
            @PathVariable String symbol,
            Authentication authentication) {

        String email = authentication.getName();

        watchlistService.addToWatchlist(email, symbol);

        return ResponseEntity.ok("Stock added to watchlist successfully");
    }

    // Get logged-in user's watchlist
    @GetMapping
    public ResponseEntity<List<WatchlistResponse>> getWatchlist(
            Authentication authentication) {

        String email = authentication.getName();

        List<WatchlistResponse> watchlist =
                watchlistService.getUserWatchlist(email);

        return ResponseEntity.ok(watchlist);
    }

    // Remove stock from watchlist
    @DeleteMapping("/{symbol}")
    public ResponseEntity<String> removeFromWatchlist(
            @PathVariable String symbol,
            Authentication authentication) {

        String email = authentication.getName();

        watchlistService.removeFromWatchlist(email, symbol);

        return ResponseEntity.ok("Stock removed from watchlist successfully");
    }
}