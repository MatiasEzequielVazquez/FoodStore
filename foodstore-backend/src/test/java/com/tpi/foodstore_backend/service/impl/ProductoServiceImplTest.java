package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.producto.ProductoCreate;
import com.tpi.foodstore_backend.dto.producto.ProductoDto;
import com.tpi.foodstore_backend.exception.ResourceNotFoundException;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.model.Producto;
import com.tpi.foodstore_backend.repository.CategoriaRepository;
import com.tpi.foodstore_backend.repository.ProductoRepository;
import com.tpi.foodstore_backend.service.ProductoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Test
    void deberiaRegistrarProductoCorrectamente() {
        // Arrange
        Categoria categoria = Categoria.builder()
                .nombre("Hamburguesas")
                .descripcion("Hamburguesas artesanales")
                .build();
        categoria.setId(1L);

        ProductoCreate dto = new ProductoCreate("Hamburguesas","Hamburguesa completa", new BigDecimal("4500"), 10, "https://ejemplo.com", true, 1L);

        when(categoriaRepository.findByIdOrThrow(dto.idCategoria())).thenReturn(categoria);
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        // Act
        ProductoDto resultado = productoService.save(dto);

        // Assert:
        assertThat(resultado.id()).isEqualTo(1L);
        assertThat(resultado.nombre()).isEqualTo("Hamburguesas");
        assertThat(resultado.precio()).isEqualByComparingTo(new BigDecimal("4500"));
    }

    @Test
    void deberiaLanzarExcepcionSiCategoriaNoExiste() {
        // Arrange
        ProductoCreate dto = new ProductoCreate("Hamburguesa", "Hamburguesa completa", new BigDecimal("4500"), 10, "https://ejemplo.com", true, 99L);

        when(categoriaRepository.findByIdOrThrow(99L)).thenThrow(new ResourceNotFoundException(99L));

        // Act + Assert
        assertThatThrownBy(() -> productoService.save(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
