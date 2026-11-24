
package com.fundex.service;

import com.fundex.dto.HistoricalPriceResponse;
import com.fundex.dto.OHLCData;
import com.fundex.entity.HistoricalPrice;
import com.fundex.entity.Stock;
import com.fundex.repository.HistoricalPriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class HistoricalDataGeneratorService {

    private final HistoricalPriceRepository historicalPriceRepository;


    public HistoricalDataGeneratorService(
            HistoricalPriceRepository historicalPriceRepository) {

        this.historicalPriceRepository = historicalPriceRepository;
    }


    private BigDecimal generatePriceMovement(
            BigDecimal previousPrice,
            double minimumPercentage,
            double maximumPercentage) {

        double movement = ThreadLocalRandom.current()
                .nextDouble(minimumPercentage, maximumPercentage);

        BigDecimal percentage = BigDecimal.valueOf(movement);

        BigDecimal change = previousPrice
                .multiply(percentage)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

        BigDecimal newPrice = previousPrice
                .add(change)
                .setScale(2, RoundingMode.HALF_UP);

        // Validate generated price
        if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException(
                    "Generated stock price must be positive"
            );
        }

        return newPrice;
    }

    private OHLCData generateDailyPrice(BigDecimal previousClose) {

        // 1. Generate today's opening price
        BigDecimal openPrice = generatePriceMovement(
                previousClose, -0.5, 0.5
        );

        // 2. Generate today's closing price
        BigDecimal closePrice = generatePriceMovement(
                openPrice, -2.0, 2.0
        );

        // 3. Generate today's highest price
        BigDecimal highPrice = generatePriceMovement(
                openPrice.max(closePrice), 0.0, 1.0
        );

        // 4. Generate today's lowest price
        BigDecimal lowPrice = generatePriceMovement(
                openPrice.min(closePrice), -1.0, 0.0
        );


        if (highPrice.compareTo(openPrice) < 0 ||
                highPrice.compareTo(closePrice) < 0 ||
                lowPrice.compareTo(openPrice) > 0 ||
                lowPrice.compareTo(closePrice) > 0) {

            throw new IllegalStateException("Invalid OHLC price generated");
        }

        // 5. Return all four prices together
        return new OHLCData(
                openPrice,
                highPrice,
                lowPrice,
                closePrice
        );
    }


    private Long generateDailyVolume() {

        return ThreadLocalRandom.current()
                .nextLong(100000, 1000000);
    }


    private List<LocalDate> generateTradingDates() {

        List<LocalDate> tradingDates = new ArrayList<>();

        LocalDate currentDate = LocalDate.now().minusYears(1);
        LocalDate endDate = LocalDate.now();

        while (!currentDate.isAfter(endDate)) {

            DayOfWeek day = currentDate.getDayOfWeek();

            if (day != DayOfWeek.SATURDAY &&
                    day != DayOfWeek.SUNDAY) {

                tradingDates.add(currentDate);
            }

            currentDate = currentDate.plusDays(1);
        }

        return tradingDates;
    }



    @Transactional
    public void generateHistoricalData(Stock stock, BigDecimal startingPrice) {

        if (startingPrice == null ||
                startingPrice.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Starting price must be greater than zero"
            );
        }

        // Check whether historical data already exists
        boolean dataExists = historicalPriceRepository
                .existsByStockId(stock.getId());

        if (dataExists) {
            throw new IllegalStateException(
                    "Historical data already exists for this stock"
            );
        }

        // Generate trading dates
        List<LocalDate> tradingDates = generateTradingDates();

        // Starting price for the first trading day
        BigDecimal previousClose = startingPrice;

        // Collect all historical records
        List<HistoricalPrice> historicalPrices = new ArrayList<>();

        for (LocalDate date : tradingDates) {

            // Generate daily OHLC prices
            OHLCData ohlc = generateDailyPrice(previousClose);

            // Generate daily volume
            Long volume = generateDailyVolume();

            // Create historical price record
            HistoricalPrice historicalPrice = new HistoricalPrice(
                    stock,
                    date,
                    ohlc.getOpenPrice(),
                    ohlc.getHighPrice(),
                    ohlc.getLowPrice(),
                    ohlc.getClosePrice(),
                    volume
            );

            // Add record to the list
            historicalPrices.add(historicalPrice);

            // Today's closing price becomes tomorrow's previous closing price
            previousClose = ohlc.getClosePrice();
        }

        // Save all historical records together
        historicalPriceRepository.saveAll(historicalPrices);
    }

    public List<HistoricalPrice> getHistoricalPrices(Long stockId) {

        return historicalPriceRepository
                .findByStockIdOrderByPriceDateAsc(stockId);
    }



    public List<HistoricalPriceResponse> getHistoricalPricesResponse(
            Long stockId) {

        List<HistoricalPrice> historicalPrices =
                getHistoricalPrices(stockId);

        List<HistoricalPriceResponse> responses = new ArrayList<>();

        for (HistoricalPrice historicalPrice : historicalPrices) {

            HistoricalPriceResponse response =
                    convertToResponse(historicalPrice);

            responses.add(response);
        }

        return responses;
    }


    private HistoricalPriceResponse convertToResponse(
            HistoricalPrice historicalPrice) {

        return new HistoricalPriceResponse(
                historicalPrice.getPriceDate(),
                historicalPrice.getOpenPrice(),
                historicalPrice.getHighPrice(),
                historicalPrice.getLowPrice(),
                historicalPrice.getClosePrice(),
                historicalPrice.getVolume()
        );
    }



}
