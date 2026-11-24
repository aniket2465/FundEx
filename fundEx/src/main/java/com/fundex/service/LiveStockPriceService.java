package com.fundex.service;

import com.fundex.dto.LiveStockPriceResponse;
import com.fundex.entity.HistoricalPrice;
import com.fundex.entity.LiveStockPrice;
import com.fundex.entity.Stock;
import com.fundex.exception.StockNotFoundException;
import com.fundex.repository.LiveStockPriceRepository;
import com.fundex.repository.HistoricalPriceRepository;
import com.fundex.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class LiveStockPriceService {

    private final LiveStockPriceRepository liveStockPriceRepository;
    private final HistoricalPriceRepository historicalPriceRepository;
    private final StockRepository stockRepository;

    public LiveStockPriceService(
            LiveStockPriceRepository liveStockPriceRepository,
            HistoricalPriceRepository historicalPriceRepository,
            StockRepository stockRepository) {

        this.liveStockPriceRepository = liveStockPriceRepository;
        this.historicalPriceRepository = historicalPriceRepository;
        this.stockRepository = stockRepository;
    }

    public void initializeLivePrice(Stock stock) {

        // Check whether a live price already exists
        if (liveStockPriceRepository.existsByStockId(stock.getId())) {
            return;
        }

        // Get the latest historical price
        HistoricalPrice latestPrice = historicalPriceRepository
                .findTopByStockIdOrderByPriceDateDesc(stock.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Historical price not found for stock: " + stock.getSymbol()
                ));

        // Use the latest closing price as the initial live price
        LiveStockPrice liveStockPrice = new LiveStockPrice(
                stock,
                latestPrice.getClosePrice()
        );

        liveStockPriceRepository.save(liveStockPrice);
    }

    public void initializeAllLivePrices() {

        List<Stock> stocks = stockRepository.findAll();

        for (Stock stock : stocks) {
            initializeLivePrice(stock);
        }
    }

    public void updateLivePrice(LiveStockPrice liveStockPrice) {

        BigDecimal currentPrice = liveStockPrice.getCurrentPrice();

        double percentageChange =
                ThreadLocalRandom.current().nextDouble(-0.5, 0.5);

        BigDecimal change = currentPrice
                .multiply(BigDecimal.valueOf(percentageChange))
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

        BigDecimal newPrice = currentPrice
                .add(change)
                .setScale(2, RoundingMode.HALF_UP);

        if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        liveStockPrice.updatePrice(newPrice);

        liveStockPriceRepository.save(liveStockPrice);
    }

    public void updateAllLivePrices() {

        List<LiveStockPrice> livePrices =
                liveStockPriceRepository.findAll();

        for (LiveStockPrice livePrice : livePrices) {
            updateLivePrice(livePrice);
        }
    }

    public LiveStockPriceResponse getLivePrice(String symbol) {

        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        LiveStockPrice livePrice = liveStockPriceRepository
                .findByStockId(stock.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Live price not found for stock: " + symbol
                ));

        return new LiveStockPriceResponse(
                stock.getSymbol(),
                livePrice.getCurrentPrice(),
                livePrice.getLastUpdated()
        );
    }





}