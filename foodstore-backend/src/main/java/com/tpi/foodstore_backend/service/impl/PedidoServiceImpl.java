package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;
import com.tpi.foodstore_backend.dto.pedido.*;
import com.tpi.foodstore_backend.dto.producto.ProductoDto;
import com.tpi.foodstore_backend.dto.usuario.UsuarioDto;
import com.tpi.foodstore_backend.exception.BusinessException;
import com.tpi.foodstore_backend.model.DetallePedido;
import com.tpi.foodstore_backend.model.Producto;
import com.tpi.foodstore_backend.model.Usuario;
import com.tpi.foodstore_backend.model.Pedido;
import com.tpi.foodstore_backend.repository.PedidoRepository;
import com.tpi.foodstore_backend.repository.ProductoRepository;
import com.tpi.foodstore_backend.repository.UsuarioRepository;
import com.tpi.foodstore_backend.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class PedidoServiceImpl implements PedidoService {
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public PedidoDto save(PedidoCreate dto) {
        BigDecimal total = BigDecimal.ZERO;
        Usuario usuario = usuarioRepository.findByIdOrThrow(dto.idUsuario());
        Pedido pedido = Pedido.builder()
                .fecha(LocalDate.now())
                .estado(dto.estado())
                .formaPago(dto.formaPago())
                .usuario(usuario)
                .total(BigDecimal.ZERO)
                .build();
        for (DetallePedidoCreate dp : dto.detallePedido()) {
            Producto producto = productoRepository.findByIdOrThrow(dp.idProducto());
            if (!producto.isDisponible()) {
                throw new BusinessException("El producto '" + producto.getNombre() + "' no está disponible");
            } else if (producto.getStock() < dp.cantidad()) {
                throw new BusinessException("Stock insuficiente para '" + producto.getNombre() + "'");
            }
            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(dp.cantidad()));
            DetallePedido detallePedido = DetallePedido.builder()
                    .cantidad(dp.cantidad())
                    .subtotal(subtotal)
                    .producto(producto)
                    .pedido(pedido)
                    .build();
            pedido.getDetallePedidos().add(detallePedido);

            producto.setStock(producto.getStock() - dp.cantidad());
            productoRepository.save(producto);
            total = total.add(subtotal);
        }
        pedido.setTotal(total);

        pedidoRepository.save(pedido);
        return toDto(pedido);
    }

    public List<PedidoDto> findAll(){
        List<PedidoDto> dtos = new ArrayList<>();
        List<Pedido> pedidos = pedidoRepository.findAll();
        for (Pedido p : pedidos){
            dtos.add(toDto(p));
        }
        return dtos;
    }

    public PedidoDto findById(Long id){
        Pedido pedido = pedidoRepository.findByIdOrThrow(id);
        return toDto(pedido);
    }

    public List<PedidoDto> findByUsuarioId(Long usuarioId){
        usuarioRepository.findByIdOrThrow(usuarioId);
        List<Pedido> pedidos = pedidoRepository.findAllByUsuarioIdAndEliminadoFalse(usuarioId);
        List<PedidoDto> dtos = new ArrayList<>();
        for (Pedido p : pedidos){
            dtos.add(toDto(p));
        }
        return dtos;
    }

    public PedidoDto update(Long id, PedidoEdit dto){
        Pedido pedido = pedidoRepository.findByIdOrThrow(id);
        if (dto.estado() != null) pedido.setEstado(dto.estado());
        if (dto.formaPago() != null) pedido.setFormaPago(dto.formaPago());
        pedidoRepository.save(pedido);
        return toDto(pedido);
    }

    public void deleteById(Long id){
        pedidoRepository.deleteById(id);
    }

    private PedidoDto toDto(Pedido pedido) {
        List<DetallePedidoDto> detallesDto = new ArrayList<>();
        for (DetallePedido dp : pedido.getDetallePedidos()) {
            Producto p = dp.getProducto();
            CategoriaDto categoriaDto = new CategoriaDto(p.getCategoria().getId(), p.getCategoria().getNombre(), p.getCategoria().getDescripcion());
            ProductoDto productoDto = new ProductoDto(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(), p.getStock(), p.getImagen(), p.isDisponible(), categoriaDto);
            detallesDto.add(new DetallePedidoDto(dp.getId(), dp.getCantidad(), dp.getSubtotal(), productoDto));
        }
        return new PedidoDto(pedido.getId(), pedido.getFecha(), pedido.getEstado(), pedido.getTotal(), pedido.getFormaPago(), pedido.getUsuario().getId(), detallesDto);
    }

}
