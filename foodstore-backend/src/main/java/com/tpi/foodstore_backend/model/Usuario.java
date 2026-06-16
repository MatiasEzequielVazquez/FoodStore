package com.tpi.foodstore_backend.model;

import com.tpi.foodstore_backend.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
public class Usuario extends Base {
    private String nombre;
    private String apellido;
    private String email;
    private String celular;
    private String password;
    @Enumerated(EnumType.STRING)
    private Rol rol;
}