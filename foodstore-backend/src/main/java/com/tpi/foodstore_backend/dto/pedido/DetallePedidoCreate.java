package com.tpi.foodstore_backend.dto.pedido;

import jakarta.validation.constraints.*;

public record DetallePedidoCreate(
        @NotNull(message = "El idProducto es obligatorio")
        Long idProducto,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad no puede ser menor a 1")
        Integer cantidad
) {}
