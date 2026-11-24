
package com.fundex.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 10)
    private String exchange;

    @Column(length = 100)
    private String sector;

    @Column(nullable = false)
    private boolean active;

    protected Stock() {
    }

    public Stock(String symbol, String companyName,
                 String exchange, String sector) {

        this.symbol = symbol;
        this.companyName = companyName;
        this.exchange = exchange;
        this.sector = sector;
        this.active = true;
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

    public String getExchange() {
        return exchange;
    }

    public String getSector() {
        return sector;
    }

    public boolean isActive() {
        return active;
    }
}
