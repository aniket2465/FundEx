
package com.fundex.dto;

import java.math.BigDecimal;

public class StockTradingActivityResponse {

    private final String symbol;

    private final long buyTransactions;
    private final long sellTransactions;

    private final long uniqueBuyers;
    private final long uniqueSellers;

    private final long buyQuantity;
    private final long sellQuantity;

    private final BigDecimal buyTransactionPercentage;
    private final BigDecimal sellTransactionPercentage;

    private final BigDecimal buyQuantityPercentage;
    private final BigDecimal sellQuantityPercentage;

    public StockTradingActivityResponse(
            String symbol,
            long buyTransactions,
            long sellTransactions,
            long uniqueBuyers,
            long uniqueSellers,
            long buyQuantity,
            long sellQuantity,
            BigDecimal buyTransactionPercentage,
            BigDecimal sellTransactionPercentage,
            BigDecimal buyQuantityPercentage,
            BigDecimal sellQuantityPercentage) {

        this.symbol = symbol;
        this.buyTransactions = buyTransactions;
        this.sellTransactions = sellTransactions;
        this.uniqueBuyers = uniqueBuyers;
        this.uniqueSellers = uniqueSellers;
        this.buyQuantity = buyQuantity;
        this.sellQuantity = sellQuantity;
        this.buyTransactionPercentage = buyTransactionPercentage;
        this.sellTransactionPercentage = sellTransactionPercentage;
        this.buyQuantityPercentage = buyQuantityPercentage;
        this.sellQuantityPercentage = sellQuantityPercentage;
    }

    public String getSymbol() {
        return symbol;
    }

    public long getBuyTransactions() {
        return buyTransactions;
    }

    public long getSellTransactions() {
        return sellTransactions;
    }

    public long getUniqueBuyers() {
        return uniqueBuyers;
    }

    public long getUniqueSellers() {
        return uniqueSellers;
    }

    public long getBuyQuantity() {
        return buyQuantity;
    }

    public long getSellQuantity() {
        return sellQuantity;
    }

    public BigDecimal getBuyTransactionPercentage() {
        return buyTransactionPercentage;
    }

    public BigDecimal getSellTransactionPercentage() {
        return sellTransactionPercentage;
    }

    public BigDecimal getBuyQuantityPercentage() {
        return buyQuantityPercentage;
    }

    public BigDecimal getSellQuantityPercentage() {
        return sellQuantityPercentage;
    }
}
