package com.fundex.service;

import com.fundex.dto.WatchlistResponse;
import com.fundex.entity.LiveStockPrice;
import com.fundex.entity.Stock;
import com.fundex.entity.User;
import com.fundex.entity.Watchlist;
import com.fundex.exception.StockNotFoundException;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.LiveStockPriceRepository;
import com.fundex.repository.WatchlistRepository;
import com.fundex.repository.StockRepository;
import com.fundex.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final LiveStockPriceRepository liveStockPriceRepository;

    public WatchlistService(
            WatchlistRepository watchlistRepository,
            StockRepository stockRepository,
            UserRepository userRepository,
            LiveStockPriceRepository liveStockPriceRepository) {

        this.watchlistRepository = watchlistRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.liveStockPriceRepository = liveStockPriceRepository;
    }

    public void addToWatchlist(String email, String symbol) {

        // Find the authenticated user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        // Find the requested stock
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        // Prevent duplicate watchlist entries
        if (watchlistRepository.existsByUserIdAndStockId(
                user.getId(), stock.getId())) {

            throw new IllegalArgumentException(
                    "Stock is already in your watchlist"
            );
        }

        // Create and save the watchlist entry
        Watchlist watchlist = new Watchlist(user, stock);

        watchlistRepository.save(watchlist);
    }

    public List<WatchlistResponse> getUserWatchlist(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        List<Watchlist> watchlists =
                watchlistRepository.findByUserId(user.getId());

        List<WatchlistResponse> responses = new ArrayList<>();

        for (Watchlist watchlist : watchlists) {

            WatchlistResponse response = convertToResponse(watchlist);

            responses.add(response);
        }

        return responses;
    }

    public void removeFromWatchlist(String email, String symbol) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        Watchlist watchlist = watchlistRepository
                .findByUserIdAndStockId(user.getId(), stock.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Stock is not in your watchlist"
                ));

        watchlistRepository.delete(watchlist);
    }

    private WatchlistResponse convertToResponse(Watchlist watchlist) {

        Stock stock = watchlist.getStock();

        LiveStockPrice livePrice = liveStockPriceRepository
                .findByStockId(stock.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Live price not found for stock: " + stock.getSymbol()
                ));

        return new WatchlistResponse(
                watchlist.getId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                livePrice.getCurrentPrice(),
                watchlist.getAddedAt()
        );
    }





}