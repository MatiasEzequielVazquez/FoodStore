package com.tpi.foodstore_backend.repository;

import com.tpi.foodstore_backend.model.Producto;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long> {
    public List<Producto> findAllByCategoriaIdAndEliminadoFalse(Long categoriaId);
}
