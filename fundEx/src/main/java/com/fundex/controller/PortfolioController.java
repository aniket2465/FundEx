
package com.fundex.controller;

import com.fundex.dto.PortfolioAllocationResponse;
import com.fundex.dto.PortfolioSummaryResponse;
import com.fundex.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/summary")
    public ResponseEntity<PortfolioSummaryResponse> getPortfolioSummary(
            Authentication authentication) {

        String email = authentication.getName();

        PortfolioSummaryResponse summary =
                portfolioService.getPortfolioSummary(email);

        return ResponseEntity.ok(summary);
    }


    @GetMapping("/allocation")
    public ResponseEntity<List<PortfolioAllocationResponse>> getPortfolioAllocation(
            Authentication authentication) {

        String email = authentication.getName();

        List<PortfolioAllocationResponse> allocation =
                portfolioService.getPortfolioAllocation(email);

        return ResponseEntity.ok(allocation);
    }

}
