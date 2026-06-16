package com.tpi.foodstore_backend.dto.usuario;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioCreate(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        String apellido,

        @NotBlank(message = "El email es obligatorio")
        @Email
        String email,

        @Size(max=20, message = "El celular debe tener un maximo de 20 caracteres")
        String celular,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min=6, message = "La contraseña debe tener al menos 6 caracteres")
        String password
) {}