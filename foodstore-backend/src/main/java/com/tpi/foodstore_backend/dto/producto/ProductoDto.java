package com.tpi.foodstore_backend.dto.producto;


import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;

import java.math.BigDecimal;

public record ProductoDto (
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        String imagen,
        boolean disponible,
        CategoriaDto categoria
){}
