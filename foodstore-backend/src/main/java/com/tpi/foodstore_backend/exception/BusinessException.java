package com.tpi.foodstore_backend.exception;

public class BusinessException extends RuntimeException{
    public BusinessException(String mensaje){
        super(mensaje);
    }
}
