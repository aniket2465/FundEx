package com.fundex.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletResponse {

    private Long id;
    private BigDecimal balance;
    private LocalDateTime createdAt;

    public WalletResponse(
            Long id,
            BigDecimal balance,
            LocalDateTime createdAt) {

        this.id = id;
        this.balance = balance;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}