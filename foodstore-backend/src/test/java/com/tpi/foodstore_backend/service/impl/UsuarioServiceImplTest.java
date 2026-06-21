package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.config.PasswordEncoder;
import com.tpi.foodstore_backend.dto.usuario.UsuarioCreate;
import com.tpi.foodstore_backend.dto.usuario.UsuarioDto;
import com.tpi.foodstore_backend.exception.BusinessException;
import com.tpi.foodstore_backend.model.Usuario;
import com.tpi.foodstore_backend.model.enums.Rol;
import com.tpi.foodstore_backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @Test
    void deberiaRegistrarUsuarioCorrectamente() {
        // Arrange
        UsuarioCreate dto = new UsuarioCreate("Juan", "Pérez", "juan@mail.com", "123456789", "clave123");

        when(usuarioRepository.findByEmailAndEliminadoFalse("juan@mail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("clave123")).thenReturn("hashEncriptado");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        // Act
        UsuarioDto resultado = usuarioService.save(dto);

        // Assert: verificar id, nombre, email, rol == Rol.USUARIO
        assertThat(resultado.id()).isEqualTo(1L);
        assertThat(resultado.nombre()).isEqualTo("Juan");
        assertThat(resultado.email()).isEqualTo("juan@mail.com");
        assertThat(resultado.rol()).isEqualTo(Rol.USUARIO);
    }

    @Test
    void deberiaLanzarExcepcionSiEmailYaExiste() {
        // Arrange:
        UsuarioCreate dto = new UsuarioCreate("Juan", "Pérez", "juan@mail.com", "123456789", "clave123");
        Usuario usuarioExistente = Usuario.builder().build();
        when(usuarioRepository.findByEmailAndEliminadoFalse("juan@mail.com")).thenReturn(Optional.of(usuarioExistente));

        // Act + Assert:
        assertThatThrownBy(() -> usuarioService.save(dto))
                .isInstanceOf(BusinessException.class);
    }
}
