package com.fundex.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "watchlists",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "stock_id"}
        )
)
public class Watchlist {

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
    private LocalDateTime addedAt;

    protected Watchlist() {
    }

    public Watchlist(User user, Stock stock) {
        this.user = user;
        this.stock = stock;
        this.addedAt = LocalDateTime.now();
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

    public LocalDateTime getAddedAt() {
        return addedAt;
    }
}