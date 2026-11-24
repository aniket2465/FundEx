
package com.fundex.dto;

import java.math.BigDecimal;

public class PortfolioSummaryResponse {

    private BigDecimal totalInvested;
    private BigDecimal currentPortfolioValue;
    private BigDecimal unrealizedProfitLoss;
    private BigDecimal realizedProfitLoss;
    private BigDecimal totalProfitLoss;

    public PortfolioSummaryResponse(
            BigDecimal totalInvested,
            BigDecimal currentPortfolioValue,
            BigDecimal unrealizedProfitLoss,
            BigDecimal realizedProfitLoss,
            BigDecimal totalProfitLoss) {

        this.totalInvested = totalInvested;
        this.currentPortfolioValue = currentPortfolioValue;
        this.unrealizedProfitLoss = unrealizedProfitLoss;
        this.realizedProfitLoss = realizedProfitLoss;
        this.totalProfitLoss = totalProfitLoss;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public BigDecimal getCurrentPortfolioValue() {
        return currentPortfolioValue;
    }

    public BigDecimal getUnrealizedProfitLoss() {
        return unrealizedProfitLoss;
    }

    public BigDecimal getRealizedProfitLoss() {
        return realizedProfitLoss;
    }

    public BigDecimal getTotalProfitLoss() {
        return totalProfitLoss;
    }
}
