package com.tpi.foodstore_backend.dto.pedido;

import com.tpi.foodstore_backend.dto.producto.ProductoDto;

import java.math.BigDecimal;

public record DetallePedidoDto(
        Long id,
        Integer cantidad,
        BigDecimal subtotal,
        ProductoDto producto
) {}