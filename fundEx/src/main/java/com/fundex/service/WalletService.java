package com.fundex.service;

import com.fundex.dto.WalletResponse;
import com.fundex.entity.User;
import com.fundex.entity.Wallet;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.UserRepository;
import com.fundex.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public WalletService(WalletRepository walletRepository,
                         UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }

    public void createWallet(User user) {

        // Check whether the user already has a wallet
        if (walletRepository.existsByUserId(user.getId())) {
            return;
        }

        // Create a new wallet with ₹1,00,000
        Wallet wallet = new Wallet(user);

        // Save wallet in the database
        walletRepository.save(wallet);
    }

    public WalletResponse getUserWallet(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Wallet not found for user: " + email
                ));

        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getCreatedAt()
        );
    }

    @Transactional
    public void debitWallet(String email, BigDecimal amount) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Wallet not found for user: " + email
                ));

        wallet.debit(amount);

        walletRepository.save(wallet);
    }

    @Transactional
    public void creditWallet(String email, BigDecimal amount) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found: " + email
                ));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Wallet not found for user: " + email
                ));

        wallet.credit(amount);

        walletRepository.save(wallet);
    }



}