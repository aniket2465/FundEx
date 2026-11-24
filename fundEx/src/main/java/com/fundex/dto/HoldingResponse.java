
package com.fundex.dto;

import java.math.BigDecimal;

public class HoldingResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private Integer quantity;
    private BigDecimal averageBuyPrice;
    private BigDecimal currentPrice;
    private BigDecimal investmentValue;

    public HoldingResponse(
            Long id,
            String symbol,
            String companyName,
            Integer quantity,
            BigDecimal averageBuyPrice,
            BigDecimal currentPrice,
            BigDecimal investmentValue) {

        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.currentPrice = currentPrice;
        this.investmentValue = investmentValue;
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

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getInvestmentValue() {
        return investmentValue;
    }
}
