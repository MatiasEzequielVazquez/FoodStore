package com.tpi.foodstore_backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
public class Producto extends Base {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private String imagen;
    @Builder.Default
    private boolean disponible = true;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
