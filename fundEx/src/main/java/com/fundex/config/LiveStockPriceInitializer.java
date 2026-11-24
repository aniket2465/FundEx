package com.fundex.config;

import com.fundex.service.LiveStockPriceService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class LiveStockPriceInitializer implements CommandLineRunner {

    private final LiveStockPriceService liveStockPriceService;

    public LiveStockPriceInitializer(
            LiveStockPriceService liveStockPriceService) {
        this.liveStockPriceService = liveStockPriceService;
    }

    @Override
    public void run(String... args) {
        liveStockPriceService.initializeAllLivePrices();
    }
}