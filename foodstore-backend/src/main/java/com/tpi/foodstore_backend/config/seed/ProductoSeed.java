package com.tpi.foodstore_backend.config.seed;

import java.math.BigDecimal;

public record ProductoSeed(
        Long id,
        String nombre,
        BigDecimal precio,
        String descripcion,
        Integer stock,
        String imagen,
        boolean disponible,
        CategoriaRefSeed categoria
) {}
