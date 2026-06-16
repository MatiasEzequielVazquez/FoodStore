package com.tpi.foodstore_backend.service;

import com.tpi.foodstore_backend.dto.CategoriaCreate;
import com.tpi.foodstore_backend.dto.CategoriaDto;
import com.tpi.foodstore_backend.dto.CategoriaEdit;

import java.util.List;

public interface CategoriaService {
    CategoriaDto save(CategoriaCreate dto);
    List<CategoriaDto> findAll();
    CategoriaDto findById(Long id);
    CategoriaDto update(Long id, CategoriaEdit dto);
    void deleteById(Long id);
}
