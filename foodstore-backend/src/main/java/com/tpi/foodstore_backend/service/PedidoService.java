package com.tpi.foodstore_backend.service;

import com.tpi.foodstore_backend.dto.pedido.PedidoCreate;
import com.tpi.foodstore_backend.dto.pedido.PedidoDto;
import com.tpi.foodstore_backend.dto.pedido.PedidoEdit;

import java.util.List;

public interface PedidoService {
    PedidoDto save(PedidoCreate dto);
    List<PedidoDto> findAll();
    PedidoDto findById(Long id);
    List<PedidoDto> findByUsuarioId(Long usuarioId);
    PedidoDto update(Long id, PedidoEdit dto);
    void deleteById(Long id);
}
