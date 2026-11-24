
package com.fundex.dto;

import java.math.BigDecimal;

public class PortfolioAllocationResponse {

    private String symbol;
    private String companyName;
    private BigDecimal currentValue;
    private BigDecimal allocationPercentage;

    public PortfolioAllocationResponse(
            String symbol,
            String companyName,
            BigDecimal currentValue,
            BigDecimal allocationPercentage) {

        this.symbol = symbol;
        this.companyName = companyName;
        this.currentValue = currentValue;
        this.allocationPercentage = allocationPercentage;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public BigDecimal getAllocationPercentage() {
        return allocationPercentage;
    }
}
