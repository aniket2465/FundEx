
package com.fundex.controller;

import com.fundex.dto.HistoricalPriceResponse;
import com.fundex.dto.LiveStockPriceResponse;
import com.fundex.dto.StockRequest;
import com.fundex.dto.StockResponse;
import com.fundex.entity.Stock;
import com.fundex.exception.StockNotFoundException;
import com.fundex.service.HistoricalDataGeneratorService;
import com.fundex.service.LiveStockPriceService;
import com.fundex.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;
    private final HistoricalDataGeneratorService historicalDataGeneratorService;
    private final LiveStockPriceService liveStockPriceService;

    public StockController(StockService stockService,
                           HistoricalDataGeneratorService historicalDataGeneratorService,
                           LiveStockPriceService liveStockPriceService) {
        this.stockService = stockService;
        this.historicalDataGeneratorService = historicalDataGeneratorService;
        this.liveStockPriceService = liveStockPriceService;
    }

    @GetMapping("/{symbol}")
    public StockResponse getStockBySymbol(
            @PathVariable String symbol) {

        Stock stock = stockService.getStockBySymbol(symbol)
                .orElseThrow(() ->
                        new StockNotFoundException("Stock not found"));

        return stockService.convertToResponse(stock);
    }

    @GetMapping("/search")
    public List<StockResponse> searchStocks(
            @RequestParam String name) {

        List<Stock> stocks =
                stockService.searchStocksByCompanyName(name);

        List<StockResponse> responses = new ArrayList<>();

        for (Stock stock : stocks) {
            responses.add(stockService.convertToResponse(stock));
        }

        return responses;
    }



    @PostMapping
    public ResponseEntity<StockResponse> createStock(
            @Valid @RequestBody StockRequest request) {

        Stock savedStock = stockService.createStock(request);

        StockResponse response =
                stockService.convertToResponse(savedStock);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping
    public List<StockResponse> getAllStocks() {

        List<Stock> stocks = stockService.getAllStocks();

        List<StockResponse> responses = new ArrayList<>();

        for (Stock stock : stocks) {
            responses.add(stockService.convertToResponse(stock));
        }

        return responses;
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<List<HistoricalPriceResponse>> getHistoricalPrices(
            @PathVariable String symbol) {

        Stock stock = stockService.getStockBySymbol(symbol)
                .orElseThrow(() -> new StockNotFoundException(
                        "Stock not found: " + symbol
                ));

        List<HistoricalPriceResponse> historicalPrices =
                historicalDataGeneratorService
                        .getHistoricalPricesResponse(stock.getId());

        return ResponseEntity.ok(historicalPrices);
    }

    @GetMapping("/{symbol}/live-price")
    public ResponseEntity<LiveStockPriceResponse> getLivePrice(
            @PathVariable String symbol) {

        LiveStockPriceResponse response =
                liveStockPriceService.getLivePrice(symbol);

        return ResponseEntity.ok(response);
    }


}
