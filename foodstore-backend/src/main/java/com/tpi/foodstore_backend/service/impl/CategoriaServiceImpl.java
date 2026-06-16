package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.categoria.CategoriaCreate;
import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;
import com.tpi.foodstore_backend.dto.categoria.CategoriaEdit;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.repository.CategoriaRepository;
import com.tpi.foodstore_backend.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService{
        private final CategoriaRepository categoriaRepository;

        public CategoriaDto save(CategoriaCreate dto) {
            Categoria categoria = Categoria.builder()
                    .nombre(dto.nombre())
                    .descripcion(dto.descripcion())
                    .build();
            categoriaRepository.save(categoria);
            return new CategoriaDto(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
        }

        public List<CategoriaDto> findAll(){
            List<CategoriaDto> dtos = new ArrayList<>();
            List<Categoria> categorias = categoriaRepository.findAll();
            for (Categoria c : categorias){
                dtos.add(new CategoriaDto(c.getId(), c.getNombre(), c.getDescripcion()));
            }
            return dtos;
        }

        public CategoriaDto findById(Long id){
            Categoria categoria = categoriaRepository.findByIdOrThrow(id);
            return new CategoriaDto(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
        }

        public CategoriaDto update(Long id, CategoriaEdit dto){
            Categoria categoria = categoriaRepository.findByIdOrThrow(id);
            if (dto.nombre() != null) categoria.setNombre(dto.nombre());
            if (dto.descripcion() != null) categoria.setDescripcion(dto.descripcion());
            categoriaRepository.save(categoria);
            return new CategoriaDto(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
        }

        public void deleteById(Long id){
            categoriaRepository.deleteById(id);
        }
}
