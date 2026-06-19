package com.tpi.foodstore_backend.dto.pedido;

import com.tpi.foodstore_backend.model.enums.Estado;
import com.tpi.foodstore_backend.model.enums.FormaPago;

public record PedidoEdit(
        Estado estado,

        FormaPago formaPago
) {}