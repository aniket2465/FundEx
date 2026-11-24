package com.fundex.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WatchlistResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private BigDecimal currentPrice;
    private LocalDateTime addedAt;

    public WatchlistResponse(
            Long id,
            String symbol,
            String companyName,
            BigDecimal currentPrice,
            LocalDateTime addedAt) {

        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.currentPrice = currentPrice;
        this.addedAt = addedAt;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }
}