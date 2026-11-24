package com.fundex.config;

import com.fundex.service.LiveStockPriceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LiveStockPriceScheduler {

    private final LiveStockPriceService liveStockPriceService;

    public LiveStockPriceScheduler(
            LiveStockPriceService liveStockPriceService) {
        this.liveStockPriceService = liveStockPriceService;
    }

    @Scheduled(fixedRate = 10000)
    public void updateStockPrices() {
        liveStockPriceService.updateAllLivePrices();
    }
}