
package com.fundex.exception;

public class StockAlreadyExistsException extends RuntimeException {

    public StockAlreadyExistsException(String message) {
        super(message);
    }
}
