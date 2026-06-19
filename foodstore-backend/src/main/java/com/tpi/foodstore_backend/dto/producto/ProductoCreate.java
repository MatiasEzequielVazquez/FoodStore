package com.tpi.foodstore_backend.dto.producto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductoCreate(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripcion debe tener un maximo de 500 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        String imagen,

        boolean disponible,

        @NotNull(message = "La categoría es obligatoria")
        Long idCategoria
) {}
