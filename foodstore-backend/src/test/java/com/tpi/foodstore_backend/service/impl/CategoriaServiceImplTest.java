package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.categoria.CategoriaCreate;
import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.repository.CategoriaRepository;
import com.tpi.foodstore_backend.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.verify;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
public class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    @Test
    void deberiaCrearCategoriaCorrectamente() {
        // Arrange (preparar datos y comportamiento simulado)
        CategoriaCreate dto = new CategoriaCreate("Bebidas", "Bebidas frías y calientes");

        Categoria categoriaGuardada = Categoria.builder()
                .nombre("Bebidas")
                .descripcion("Bebidas frías y calientes")
                .build();
        categoriaGuardada.setId(1L);

        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoriaGuardada);

        // Act (ejecutar el método a testear)
        CategoriaDto resultado = categoriaService.save(dto);

        // Assert (verificar el resultado)
        assertThat(resultado.id()).isEqualTo(1L);
        assertThat(resultado.nombre()).isEqualTo("Bebidas");
        assertThat(resultado.descripcion()).isEqualTo("Bebidas frías y calientes");
    }

    @Test
    void deberiaLanzarExcepcionSiCategoriaNoExiste() {
        // Arrange
        when(categoriaRepository.findByIdOrThrow(99L))
                .thenThrow(new ResourceNotFoundException(99L));

        // Act + Assert
        assertThatThrownBy(() -> categoriaService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deberiaEliminarCategoriaCorrectamente() {
        // Act
        categoriaService.deleteById(1L);

        // Assert
        verify(categoriaRepository).deleteById(1L);
    }
}
