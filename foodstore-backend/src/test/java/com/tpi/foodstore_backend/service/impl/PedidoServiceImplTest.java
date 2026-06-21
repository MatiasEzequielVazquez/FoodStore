package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.pedido.DetallePedidoCreate;
import com.tpi.foodstore_backend.dto.pedido.PedidoCreate;
import com.tpi.foodstore_backend.exception.BusinessException;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.model.Producto;
import com.tpi.foodstore_backend.model.Usuario;
import com.tpi.foodstore_backend.model.enums.Estado;
import com.tpi.foodstore_backend.model.enums.FormaPago;
import com.tpi.foodstore_backend.repository.PedidoRepository;
import com.tpi.foodstore_backend.repository.ProductoRepository;
import com.tpi.foodstore_backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.tpi.foodstore_backend.dto.pedido.PedidoDto;
import com.tpi.foodstore_backend.model.Pedido;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
public class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    @Test
    void deberiaLanzarExcepcionSiStockInsuficiente() {
        // Arrange
        Usuario usuario = Usuario.builder().build();
        usuario.setId(1L);

        Producto producto = Producto.builder()
                .nombre("Hamburguesa")
                .precio(new BigDecimal("4500"))
                .stock(2)
                .disponible(true)
                .build();
        producto.setId(1L);

        DetallePedidoCreate detalle = new DetallePedidoCreate(1L, 5); // pide 5, hay 2
        PedidoCreate dto = new PedidoCreate(Estado.PENDIENTE, FormaPago.EFECTIVO, 1L, List.of(detalle));

        when(usuarioRepository.findByIdOrThrow(1L)).thenReturn(usuario);
        when(productoRepository.findByIdOrThrow(1L)).thenReturn(producto);

        // Act + Assert
        assertThatThrownBy(() -> pedidoService.save(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Stock insuficiente");
    }

    @Test
    void deberiaCrearPedidoYCalcularTotalCorrectamente() {
        // Arrange
        Usuario usuario = Usuario.builder().build();
        usuario.setId(1L);

        Categoria categoria = Categoria.builder()
                .nombre("Hamburguesas")
                .descripcion("Hamburguesas artesanales")
                .build();
        categoria.setId(1L);

        Producto producto = Producto.builder()
                .nombre("Hamburguesa")
                .precio(new BigDecimal("4500"))
                .stock(10)
                .disponible(true)
                .categoria(categoria)
                .build();
        producto.setId(1L);

        DetallePedidoCreate detalle = new DetallePedidoCreate(1L, 2); // 2 unidades
        PedidoCreate dto = new PedidoCreate(Estado.PENDIENTE, FormaPago.EFECTIVO, 1L, List.of(detalle));

        when(usuarioRepository.findByIdOrThrow(1L)).thenReturn(usuario);
        when(productoRepository.findByIdOrThrow(1L)).thenReturn(producto);
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        // Act
        PedidoDto resultado = pedidoService.save(dto);

        // Assert
        assertThat(resultado.total()).isEqualByComparingTo(new BigDecimal("9000"));
        assertThat(producto.getStock()).isEqualTo(8);
    }
}
