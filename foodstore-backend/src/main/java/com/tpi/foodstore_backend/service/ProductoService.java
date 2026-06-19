package com.tpi.foodstore_backend.service;

import com.tpi.foodstore_backend.dto.producto.ProductoCreate;
import com.tpi.foodstore_backend.dto.producto.ProductoDto;
import com.tpi.foodstore_backend.dto.producto.ProductoEdit;

import java.util.List;

public interface ProductoService {
    ProductoDto save(ProductoCreate dto);
    List<ProductoDto> findAll();
    ProductoDto findById(Long id);
    List<ProductoDto> findByCategoriaId(Long categoriaId);
    ProductoDto update(Long id, ProductoEdit dto);
    void deleteById(Long id);
}
