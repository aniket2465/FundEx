package com.fundex.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_stock_prices")
public class LiveStockPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false, unique = true)
    private Stock stock;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    protected LiveStockPrice() {
    }

    public LiveStockPrice(Stock stock, BigDecimal currentPrice) {
        this.stock = stock;
        this.currentPrice = currentPrice;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Stock getStock() {
        return stock;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void updatePrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
        this.lastUpdated = LocalDateTime.now();
    }
}