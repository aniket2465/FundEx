package com.fundex.service;

import com.fundex.dto.HoldingResponse;
import com.fundex.entity.Holding;
import com.fundex.entity.LiveStockPrice;
import com.fundex.entity.Stock;
import com.fundex.entity.User;
import com.fundex.exception.UserNotFoundException;
import com.fundex.repository.HoldingRepository;
import com.fundex.repository.LiveStockPriceRepository;
import com.fundex.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HoldingService {

    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;
    private final LiveStockPriceRepository liveStockPriceRepository;

    public HoldingService(
            HoldingRepository holdingRepository,
            UserRepository userRepository,
            LiveStockPriceRepository liveStockPriceRepository) {

        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
        this.liveStockPriceRepository = liveStockPriceRepository;
    }


    public void addHolding(
            User user,
            Stock stock,
            Integer quantity,
            BigDecimal purchasePrice) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        if (purchasePrice == null ||
                purchasePrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Purchase price must be greater than zero"
            );
        }

        Optional<Holding> optionalHolding =
                holdingRepository.findByUserIdAndStockId(
                        user.getId(),
                        stock.getId()
                );

        if (optionalHolding.isPresent()) {

            Holding holding = optionalHolding.get();

            holding.addShares(quantity, purchasePrice);

            holdingRepository.save(holding);

        } else {

            Holding holding = new Holding(
                    user,
                    stock,
                    quantity,
                    purchasePrice
            );

            holdingRepository.save(holding);
        }
    }

    public void removeHolding(
            Long userId,
            Long stockId,
            Integer quantity) {

        Holding holding = holdingRepository
                .findByUserIdAndStockId(userId, stockId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "You do not own this stock"
                ));

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        if (holding.getQuantity() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient stock quantity"
            );
        }

        int remainingQuantity = holding.getQuantity() - quantity;

        if (remainingQuantity == 0) {
            holdingRepository.delete(holding);
        } else {
            holding.updateQuantity(remainingQuantity);
            holdingRepository.save(holding);
        }
    }


    public List<HoldingResponse> getUserHoldings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found"
                ));

        List<Holding> holdings = holdingRepository.findByUserId(user.getId());

        List<HoldingResponse> responses = new ArrayList<>();

        for (Holding holding : holdings) {

            LiveStockPrice liveStockPrice = liveStockPriceRepository
                    .findByStockId(holding.getStock().getId())
                    .orElseThrow(() -> new IllegalStateException(
                            "Live price not found"
                    ));

            BigDecimal currentPrice = liveStockPrice.getCurrentPrice();

            BigDecimal investmentValue = currentPrice.multiply(
                    BigDecimal.valueOf(holding.getQuantity())
            );

            HoldingResponse response = new HoldingResponse(
                    holding.getId(),
                    holding.getStock().getSymbol(),
                    holding.getStock().getCompanyName(),
                    holding.getQuantity(),
                    holding.getAverageBuyPrice(),
                    currentPrice,
                    investmentValue
            );

            responses.add(response);
        }

        return responses;
    }





}