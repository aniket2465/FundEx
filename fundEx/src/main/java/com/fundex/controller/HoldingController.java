
package com.fundex.controller;

import com.fundex.dto.HoldingResponse;
import com.fundex.service.HoldingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holdings")
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping
    public ResponseEntity<List<HoldingResponse>> getUserHoldings(
            Authentication authentication) {

        String email = authentication.getName();

        List<HoldingResponse> holdings =
                holdingService.getUserHoldings(email);

        return ResponseEntity.ok(holdings);
    }
}
