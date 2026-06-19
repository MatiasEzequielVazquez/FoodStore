package com.tpi.foodstore_backend.dto.pedido;

import com.tpi.foodstore_backend.model.enums.Estado;
import com.tpi.foodstore_backend.model.enums.FormaPago;
import jakarta.validation.constraints.*;

import java.util.List;

public record PedidoCreate(
        @NotNull(message = "El estado es obligatorio")
        Estado estado,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago,

        @NotNull(message = "El idUsuario es obligatorio")
        Long idUsuario,

        @NotNull(message = "El detallePedido es obligatorio")
        @NotEmpty
        List<DetallePedidoCreate> detallePedido

) {
}
