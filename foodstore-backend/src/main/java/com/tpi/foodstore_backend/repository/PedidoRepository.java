package com.tpi.foodstore_backend.repository;

import com.tpi.foodstore_backend.model.Pedido;

import java.util.List;

public interface PedidoRepository extends BaseRepository<Pedido, Long> {
    List<Pedido> findAllByUsuarioIdAndEliminadoFalse(Long usuarioId);
}
