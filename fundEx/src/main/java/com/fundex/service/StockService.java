
package com.fundex.service;

import com.fundex.dto.StockRequest;
import com.fundex.dto.StockResponse;
import com.fundex.entity.Stock;
import com.fundex.exception.StockAlreadyExistsException;
import com.fundex.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final HistoricalDataGeneratorService historicalDataGeneratorService;

    public StockService(StockRepository stockRepository,HistoricalDataGeneratorService historicalDataGeneratorService) {
        this.stockRepository = stockRepository;
        this.historicalDataGeneratorService = historicalDataGeneratorService;
    }

    public Optional<Stock> getStockBySymbol(String symbol) {
        return stockRepository.findBySymbol(
                symbol.toUpperCase()
        );
    }

    public List<Stock> searchStocksByCompanyName(String companyName) {
        return stockRepository
                .findByCompanyNameContainingIgnoreCase(companyName);
    }


    @Transactional
    public Stock createStock(StockRequest request) {

        String symbol = request.getSymbol().trim().toUpperCase();

        Optional<Stock> existingStock =
                stockRepository.findBySymbol(symbol);

        if (existingStock.isPresent()) {
            throw new StockAlreadyExistsException(
                    "Stock symbol already exists"
            );
        }

        Stock stock = new Stock(
                symbol,
                request.getCompanyName().trim(),
                request.getExchange().trim().toUpperCase(),
                request.getSector() == null
                        ? null
                        : request.getSector().trim()
        );

        // Save stock first
        Stock savedStock = stockRepository.save(stock);

        // Generate historical data
        historicalDataGeneratorService.generateHistoricalData(
                savedStock,
                request.getStartingPrice()
        );

        return savedStock;
    }


    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }







    public StockResponse convertToResponse(Stock stock) {

        return new StockResponse(
                stock.getId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                stock.getExchange(),
                stock.getSector(),
                stock.isActive()
        );
    }

}
