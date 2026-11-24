
package com.fundex.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "historical_prices",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"stock_id", "price_date"}
                )
        }
)
public class HistoricalPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal openPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal highPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal lowPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal closePrice;

    private Long volume;

    protected HistoricalPrice() {
    }

    public HistoricalPrice(
            Stock stock,
            LocalDate priceDate,
            BigDecimal openPrice,
            BigDecimal highPrice,
            BigDecimal lowPrice,
            BigDecimal closePrice,
            Long volume) {

        this.stock = stock;
        this.priceDate = priceDate;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
    }

    public Long getId() {
        return id;
    }

    public Stock getStock() {
        return stock;
    }

    public LocalDate getPriceDate() {
        return priceDate;
    }

    public BigDecimal getOpenPrice() {
        return openPrice;
    }

    public BigDecimal getHighPrice() {
        return highPrice;
    }

    public BigDecimal getLowPrice() {
        return lowPrice;
    }

    public BigDecimal getClosePrice() {
        return closePrice;
    }

    public Long getVolume() {
        return volume;
    }
}
