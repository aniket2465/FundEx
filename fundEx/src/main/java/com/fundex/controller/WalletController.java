package com.fundex.controller;

import com.fundex.dto.WalletResponse;
import com.fundex.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(
            Authentication authentication) {

        String email = authentication.getName();

        WalletResponse wallet =
                walletService.getUserWallet(email);

        return ResponseEntity.ok(wallet);
    }
}