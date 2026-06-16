package com.tpi.foodstore_backend.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(Long id){
        super("Entidad con ID " + id + "no encontrado");
    }
}
