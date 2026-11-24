
package com.fundex.service;

import com.fundex.dto.PortfolioAllocationResponse;
import com.fundex.dto.PortfolioSummaryResponse;
import com.fundex.entity.Holding;
import com.fundex.entity.StockTransaction;
import com.fundex.entity.TransactionType;
import com.fundex.entity.User;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.HoldingRepository;
import com.fundex.repository.LiveStockPriceRepository;
import com.fundex.repository.TransactionRepository;
import com.fundex.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;
    private final LiveStockPriceRepository liveStockPriceRepository;
    private final TransactionRepository transactionRepository;

    public PortfolioService(
            UserRepository userRepository,
            HoldingRepository holdingRepository,
            LiveStockPriceRepository liveStockPriceRepository,
            TransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.holdingRepository = holdingRepository;
        this.liveStockPriceRepository = liveStockPriceRepository;
        this.transactionRepository = transactionRepository;
    }

    // Calculate portfolio summary
    public PortfolioSummaryResponse getPortfolioSummary(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found"
                ));

        List<Holding> holdings =
                holdingRepository.findByUserId(user.getId());

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal currentPortfolioValue = BigDecimal.ZERO;

        // Calculate invested amount and current portfolio value
        for (Holding holding : holdings) {

            BigDecimal quantity = BigDecimal.valueOf(
                    holding.getQuantity()
            );

            BigDecimal averageBuyPrice =
                    holding.getAverageBuyPrice();

            BigDecimal currentPrice = liveStockPriceRepository
                    .findByStockId(holding.getStock().getId())
                    .orElseThrow(() -> new IllegalStateException(
                            "Live price not found"
                    ))
                    .getCurrentPrice();

            BigDecimal investedAmount =
                    averageBuyPrice.multiply(quantity);

            BigDecimal currentValue =
                    currentPrice.multiply(quantity);

            totalInvested = totalInvested.add(investedAmount);

            currentPortfolioValue =
                    currentPortfolioValue.add(currentValue);
        }

        // Calculate unrealized profit/loss
        BigDecimal unrealizedProfitLoss =
                currentPortfolioValue.subtract(totalInvested);

        // Calculate realized profit/loss
        BigDecimal realizedProfitLoss =
                calculateRealizedProfitLoss(user.getId());

        // Calculate overall profit/loss
        BigDecimal totalProfitLoss =
                unrealizedProfitLoss.add(realizedProfitLoss);

        return new PortfolioSummaryResponse(
                totalInvested,
                currentPortfolioValue,
                unrealizedProfitLoss,
                realizedProfitLoss,
                totalProfitLoss
        );
    }

    // Calculate realized profit/loss using weighted average cost
    private BigDecimal calculateRealizedProfitLoss(Long userId) {

        List<StockTransaction> transactions =
                transactionRepository
                        .findByUserIdOrderByTransactionDateAsc(userId);

        Map<Long, Integer> quantities = new HashMap<>();
        Map<Long, BigDecimal> averagePrices = new HashMap<>();

        BigDecimal realizedProfitLoss = BigDecimal.ZERO;

        for (StockTransaction transaction : transactions) {

            Long stockId = transaction.getStock().getId();
            Integer quantity = transaction.getQuantity();
            BigDecimal price = transaction.getPrice();

            // Process BUY transaction
            if (transaction.getTransactionType() == TransactionType.BUY) {

                int oldQuantity = quantities.getOrDefault(stockId, 0);

                BigDecimal oldAveragePrice =
                        averagePrices.getOrDefault(
                                stockId,
                                BigDecimal.ZERO
                        );

                BigDecimal oldCost =
                        oldAveragePrice.multiply(
                                BigDecimal.valueOf(oldQuantity)
                        );

                BigDecimal newCost =
                        price.multiply(
                                BigDecimal.valueOf(quantity)
                        );

                int totalQuantity = oldQuantity + quantity;

                BigDecimal newAveragePrice = oldCost.add(newCost)
                        .divide(
                                BigDecimal.valueOf(totalQuantity),
                                2,
                                RoundingMode.HALF_UP
                        );

                quantities.put(stockId, totalQuantity);
                averagePrices.put(stockId, newAveragePrice);
            }

            // Process SELL transaction
            else if (transaction.getTransactionType() == TransactionType.SELL) {

                BigDecimal averageBuyPrice = averagePrices.get(stockId);

                BigDecimal profitLoss = price.subtract(averageBuyPrice)
                        .multiply(
                                BigDecimal.valueOf(quantity)
                        );

                realizedProfitLoss =
                        realizedProfitLoss.add(profitLoss);

                int remainingQuantity =
                        quantities.get(stockId) - quantity;

                if (remainingQuantity == 0) {

                    quantities.remove(stockId);
                    averagePrices.remove(stockId);

                } else {

                    quantities.put(stockId, remainingQuantity);
                }
            }
        }

        return realizedProfitLoss;
    }

    // Calculate stock-wise portfolio allocation
    public List<PortfolioAllocationResponse> getPortfolioAllocation(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found"
                ));

        List<Holding> holdings =
                holdingRepository.findByUserId(user.getId());

        BigDecimal totalPortfolioValue = BigDecimal.ZERO;

        Map<Long, BigDecimal> stockValues = new HashMap<>();

        // Calculate the current value of each stock
        for (Holding holding : holdings) {

            BigDecimal quantity = BigDecimal.valueOf(
                    holding.getQuantity()
            );

            BigDecimal currentPrice = liveStockPriceRepository
                    .findByStockId(holding.getStock().getId())
                    .orElseThrow(() -> new IllegalStateException(
                            "Live price not found"
                    ))
                    .getCurrentPrice();

            BigDecimal currentValue = currentPrice.multiply(quantity);

            stockValues.put(holding.getStock().getId(), currentValue);

            totalPortfolioValue =
                    totalPortfolioValue.add(currentValue);
        }

        // Handle empty portfolio
        if (totalPortfolioValue.compareTo(BigDecimal.ZERO) == 0) {
            return new ArrayList<>();
        }

        List<PortfolioAllocationResponse> responses = new ArrayList<>();

        // Calculate allocation percentage
        for (Holding holding : holdings) {

            BigDecimal currentValue =
                    stockValues.get(holding.getStock().getId());

            BigDecimal allocationPercentage = currentValue
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalPortfolioValue, 2, RoundingMode.HALF_UP);

            PortfolioAllocationResponse response =
                    new PortfolioAllocationResponse(
                            holding.getStock().getSymbol(),
                            holding.getStock().getCompanyName(),
                            currentValue,
                            allocationPercentage
                    );

            responses.add(response);
        }

        return responses;
    }
}
