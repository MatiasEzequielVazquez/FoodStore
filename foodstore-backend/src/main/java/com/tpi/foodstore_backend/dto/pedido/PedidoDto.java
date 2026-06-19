package com.tpi.foodstore_backend.dto.pedido;

import com.tpi.foodstore_backend.model.enums.Estado;
import com.tpi.foodstore_backend.model.enums.FormaPago;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PedidoDto (
        Long id,
        LocalDate fecha,
        Estado estado,
        BigDecimal total,
        FormaPago formaPago,
        Long idUsuario,
        List<DetallePedidoDto> detalles
){}
