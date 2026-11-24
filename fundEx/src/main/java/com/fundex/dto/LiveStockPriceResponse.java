package com.fundex.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LiveStockPriceResponse {

    private String symbol;
    private BigDecimal currentPrice;
    private LocalDateTime lastUpdated;

    public LiveStockPriceResponse(
            String symbol,
            BigDecimal currentPrice,
            LocalDateTime lastUpdated) {

        this.symbol = symbol;
        this.currentPrice = currentPrice;
        this.lastUpdated = lastUpdated;
    }

    public String getSymbol() {
        return symbol;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
}