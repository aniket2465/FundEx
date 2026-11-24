package com.fundex.service;

import com.fundex.dto.TransactionResponse;
import com.fundex.entity.*;
import com.fundex.exception.StockNotFoundException;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.TransactionRepository;
import com.fundex.repository.UserRepository;
import com.fundex.repository.StockRepository;
import com.fundex.repository.WalletRepository;
import com.fundex.repository.LiveStockPriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final WalletRepository walletRepository;
    private final LiveStockPriceRepository liveStockPriceRepository;
    private final HoldingService holdingService;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            StockRepository stockRepository,
            WalletRepository walletRepository,
            LiveStockPriceRepository liveStockPriceRepository,
            HoldingService holdingService) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.walletRepository = walletRepository;
        this.liveStockPriceRepository = liveStockPriceRepository;
        this.holdingService = holdingService;
    }


    @Transactional
    public void buyStock(String email, String symbol, Integer quantity) {

        // 1. Find authenticated user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        // 2. Find stock
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        // 3. Get current simulated price
        LiveStockPrice livePrice = liveStockPriceRepository
                .findByStockId(stock.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Live price not found for: " + symbol
                ));

        BigDecimal price = livePrice.getCurrentPrice();

        // 4. Calculate total purchase amount
        BigDecimal totalAmount = price.multiply(
                BigDecimal.valueOf(quantity)
        );

        // 5. Find user's wallet
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Wallet not found for user: " + email
                ));

        // 6. Deduct purchase amount
        wallet.debit(totalAmount);

        walletRepository.save(wallet);

        // 7. Create BUY transaction
        StockTransaction transaction = new StockTransaction(
                user,
                stock,
                TransactionType.BUY,
                quantity,
                price,
                totalAmount
        );

        // 8. Save transaction
        transactionRepository.save(transaction);

        holdingService.addHolding(
                user,
                stock,
                quantity,
                price
        );
    }


    @Transactional
    public void sellStock(String email, String symbol, Integer quantity) {

        // 1. Find authenticated user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        // 2. Find stock
        Stock stock = stockRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        // 3. Get current simulated price
        LiveStockPrice livePrice = liveStockPriceRepository
                .findByStockId(stock.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Live price not found for: " + symbol
                ));

        BigDecimal price = livePrice.getCurrentPrice();

        // 4. Calculate total selling amount
        BigDecimal totalAmount = price.multiply(
                BigDecimal.valueOf(quantity)
        );

        // 5. Reduce user's stock holding
        holdingService.removeHolding(
                user.getId(),
                stock.getId(),
                quantity
        );

        // 6. Find user's wallet
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Wallet not found for user: " + email
                ));

        // 7. Add selling proceeds to wallet
        wallet.credit(totalAmount);

        walletRepository.save(wallet);

        // 8. Create SELL transaction
        StockTransaction transaction = new StockTransaction(
                user,
                stock,
                TransactionType.SELL,
                quantity,
                price,
                totalAmount
        );

        // 9. Save transaction
        transactionRepository.save(transaction);
    }


    public List<TransactionResponse> getUserTransactions(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found"
                ));

        List<StockTransaction> transactions =
                transactionRepository
                        .findByUserIdOrderByTransactionDateDesc(user.getId());

        List<TransactionResponse> responses = new ArrayList<>();

        for (StockTransaction transaction : transactions) {

            TransactionResponse response = new TransactionResponse(
                    transaction.getId(),
                    transaction.getStock().getSymbol(),
                    transaction.getTransactionType(),
                    transaction.getQuantity(),
                    transaction.getPrice(),
                    transaction.getTotalAmount(),
                    transaction.getTransactionDate()
            );

            responses.add(response);
        }

        return responses;
    }





}