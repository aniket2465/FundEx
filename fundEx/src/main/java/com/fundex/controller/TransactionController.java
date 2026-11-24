
package com.fundex.controller;

import com.fundex.dto.TradeRequest;
import com.fundex.dto.TransactionResponse;
import com.fundex.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Buy stock
    @PostMapping("/buy/{symbol}")
    public ResponseEntity<String> buyStock(
            @PathVariable String symbol,
            @Valid @RequestBody TradeRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        transactionService.buyStock(
                email,
                symbol,
                request.getQuantity()
        );

        return ResponseEntity.ok(
                "Stock purchased successfully"
        );
    }

    // Sell stock
    @PostMapping("/sell/{symbol}")
    public ResponseEntity<String> sellStock(
            @PathVariable String symbol,
            @Valid @RequestBody TradeRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        transactionService.sellStock(
                email,
                symbol,
                request.getQuantity()
        );

        return ResponseEntity.ok(
                "Stock sold successfully"
        );
    }


    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            Authentication authentication) {

        String email = authentication.getName();

        List<TransactionResponse> transactions =
                transactionService.getUserTransactions(email);

        return ResponseEntity.ok(transactions);
    }


}
