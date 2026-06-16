package com.tpi.foodstore_backend.dto.usuario;

import com.tpi.foodstore_backend.model.enums.Rol;

public record UsuarioDto(
        Long id,
        String nombre,
        String apellido,
        String email,
        String celular,
        Rol rol
) {}
