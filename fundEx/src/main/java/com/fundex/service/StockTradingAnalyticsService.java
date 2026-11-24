
package com.fundex.service;

import com.fundex.dto.StockTradingActivityResponse;
import com.fundex.entity.Stock;
import com.fundex.entity.TransactionType;
import com.fundex.exception.StockNotFoundException;
import com.fundex.repository.StockRepository;
import com.fundex.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Transactional(readOnly = true)
public class StockTradingAnalyticsService {

    private final TransactionRepository transactionRepository;
    private final StockRepository stockRepository;

    public StockTradingAnalyticsService(
            TransactionRepository transactionRepository,
            StockRepository stockRepository) {

        this.transactionRepository = transactionRepository;
        this.stockRepository = stockRepository;
    }

    public StockTradingActivityResponse getTradingActivity(String symbol) {

        // 1. Find the stock
        Stock stock = stockRepository.findBySymbol(
                symbol.trim().toUpperCase()
        ).orElseThrow(() -> new StockNotFoundException(
                "Stock not found: " + symbol
        ));

        Long stockId = stock.getId();

        // 2. Count BUY and SELL transactions
        long buyTransactions =
                transactionRepository.countByStockIdAndTransactionType(
                        stockId, TransactionType.BUY
                );

        long sellTransactions =
                transactionRepository.countByStockIdAndTransactionType(
                        stockId, TransactionType.SELL
                );

        // 3. Count unique buyers and sellers
        long uniqueBuyers =
                transactionRepository.countDistinctInvestors(
                        stockId, TransactionType.BUY
                );

        long uniqueSellers =
                transactionRepository.countDistinctInvestors(
                        stockId, TransactionType.SELL
                );

        // 4. Calculate total BUY and SELL quantities
        long buyQuantity = transactionRepository
                .sumQuantityByStockAndType(
                        stockId, TransactionType.BUY
                );

        long sellQuantity = transactionRepository
                .sumQuantityByStockAndType(
                        stockId, TransactionType.SELL
                );

        // 5. Calculate total transactions and total quantity
        long totalTransactions = buyTransactions + sellTransactions;
        long totalQuantity = buyQuantity + sellQuantity;

        // 6. Calculate transaction percentages
        BigDecimal buyTransactionPercentage =
                calculatePercentage(buyTransactions, totalTransactions);

        BigDecimal sellTransactionPercentage =
                calculatePercentage(sellTransactions, totalTransactions);

        // 7. Calculate quantity percentages
        BigDecimal buyQuantityPercentage =
                calculatePercentage(buyQuantity, totalQuantity);

        BigDecimal sellQuantityPercentage =
                calculatePercentage(sellQuantity, totalQuantity);

        // 8. Return analytics response
        return new StockTradingActivityResponse(
                stock.getSymbol(),
                buyTransactions,
                sellTransactions,
                uniqueBuyers,
                uniqueSellers,
                buyQuantity,
                sellQuantity,
                buyTransactionPercentage,
                sellTransactionPercentage,
                buyQuantityPercentage,
                sellQuantityPercentage
        );
    }

    private BigDecimal calculatePercentage(long value, long total) {

        if (total == 0) {
            return BigDecimal.ZERO.setScale(2);
        }

        return BigDecimal.valueOf(value)
                .multiply(BigDecimal.valueOf(100))
                .divide(
                        BigDecimal.valueOf(total),
                        2,
                        RoundingMode.HALF_UP
                );
    }
}
