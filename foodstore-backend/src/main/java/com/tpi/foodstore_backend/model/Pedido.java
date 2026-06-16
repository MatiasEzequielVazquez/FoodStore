package com.tpi.foodstore_backend.model;

import com.tpi.foodstore_backend.model.enums.Estado;
import com.tpi.foodstore_backend.model.enums.FormaPago;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
public class Pedido extends Base{
    private LocalDate fecha;
    @Enumerated(EnumType.STRING)
    private Estado estado;
    private BigDecimal total;
    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @Builder.Default
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<DetallePedido> detallePedidos = new HashSet<>();
}
