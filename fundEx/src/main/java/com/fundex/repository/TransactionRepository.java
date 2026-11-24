
package com.fundex.repository;

import com.fundex.entity.StockTransaction;
import com.fundex.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<StockTransaction, Long> {


    List<StockTransaction> findByUserIdOrderByTransactionDateDesc(
            Long userId
    );

    List<StockTransaction> findByUserIdAndStockIdOrderByTransactionDateDesc(
            Long userId,
            Long stockId
    );

    List<StockTransaction> findByUserIdAndTransactionType(
            Long userId,
            TransactionType transactionType
    );

    List<StockTransaction> findByUserIdOrderByTransactionDateAsc(
            Long userId
    );




    long countByStockIdAndTransactionType(
            Long stockId,
            TransactionType transactionType
    );

    // Count unique users who bought or sold a particular stock
    @Query("""
            SELECT COUNT(DISTINCT t.user.id)
            FROM StockTransaction t
            WHERE t.stock.id = :stockId
            AND t.transactionType = :type
            """)
    long countDistinctInvestors(
            @Param("stockId") Long stockId,
            @Param("type") TransactionType type
    );

    // Calculate total shares bought or sold
    @Query("""
            SELECT COALESCE(SUM(t.quantity), 0)
            FROM StockTransaction t
            WHERE t.stock.id = :stockId
            AND t.transactionType = :type
            """)
    Long sumQuantityByStockAndType(
            @Param("stockId") Long stockId,
            @Param("type") TransactionType type
    );
}
