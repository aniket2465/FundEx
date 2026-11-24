
package com.fundex.controller;

import com.fundex.dto.StockTradingActivityResponse;
import com.fundex.service.StockTradingAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminAnalyticsController {

    private final StockTradingAnalyticsService analyticsService;

    public AdminAnalyticsController(
            StockTradingAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/stocks/{symbol}/trading-activity")
    public ResponseEntity<StockTradingActivityResponse> getStockTradingActivity(
            @PathVariable String symbol) {

        StockTradingActivityResponse response =
                analyticsService.getTradingActivity(symbol);

        return ResponseEntity.ok(response);
    }
}
