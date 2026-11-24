
package com.fundex.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(
        name = "holdings",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "stock_id"}
        )
)
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal averageBuyPrice;

    protected Holding() {
    }

    public Holding(
            User user,
            Stock stock,
            Integer quantity,
            BigDecimal averageBuyPrice) {

        this.user = user;
        this.stock = stock;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Stock getStock() {
        return stock;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void updateQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public void addShares(Integer newQuantity, BigDecimal purchasePrice) {

        BigDecimal existingCost = averageBuyPrice.multiply(
                BigDecimal.valueOf(quantity)
        );

        BigDecimal newCost = purchasePrice.multiply(
                BigDecimal.valueOf(newQuantity)
        );

        int totalQuantity = Math.addExact(quantity, newQuantity);

        BigDecimal totalCost = existingCost.add(newCost);

        this.averageBuyPrice = totalCost.divide(
                BigDecimal.valueOf(totalQuantity),
                2,
                RoundingMode.HALF_UP
        );

        this.quantity = totalQuantity;
    }

}
