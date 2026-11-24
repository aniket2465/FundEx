
package com.fundex.dto;

import com.fundex.entity.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String symbol;
    private TransactionType transactionType;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
    private LocalDateTime transactionDate;

    public TransactionResponse(
            Long id,
            String symbol,
            TransactionType transactionType,
            Integer quantity,
            BigDecimal price,
            BigDecimal totalAmount,
            LocalDateTime transactionDate) {

        this.id = id;
        this.symbol = symbol;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.price = price;
        this.totalAmount = totalAmount;
        this.transactionDate = transactionDate;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
}
