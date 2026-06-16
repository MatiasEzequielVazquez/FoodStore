package com.tpi.foodstore_backend.controller;

import com.tpi.foodstore_backend.dto.CategoriaCreate;
import com.tpi.foodstore_backend.dto.CategoriaDto;
import com.tpi.foodstore_backend.dto.CategoriaEdit;
import com.tpi.foodstore_backend.service.CategoriaService;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/categorias")
@RequiredArgsConstructor

public class CategoriaController {
    private final CategoriaService categoriaService;


    @PostMapping
    public ResponseEntity<CategoriaDto> save (@Valid @RequestBody CategoriaCreate dto){
        return ResponseEntity.status(201).body(categoriaService.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> findAll(){
        return ResponseEntity.status(200).body(categoriaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> findById(@PathVariable Long id){
        return ResponseEntity.status(200).body(categoriaService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> update(@PathVariable Long id, @Valid @RequestBody CategoriaEdit dto){
        return ResponseEntity.status(200).body(categoriaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        categoriaService.deleteById(id);
        return ResponseEntity.status(204).build();
    }
}
