package com.tpi.foodstore_backend.controller;

import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;
import com.tpi.foodstore_backend.dto.producto.*;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;


    @PostMapping
    public ResponseEntity<ProductoDto> save (@Valid @RequestBody ProductoCreate dto){
        return ResponseEntity.status(201).body(productoService.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProductoDto>> findAll(){
        return ResponseEntity.status(200).body(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> findById(@PathVariable Long id){
        return ResponseEntity.status(200).body(productoService.findById(id));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDto>> findByCategoriaId(@PathVariable Long categoriaId){
        return ResponseEntity.status(200).body(productoService.findByCategoriaId(categoriaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> update(@PathVariable Long id, @Valid @RequestBody ProductoEdit dto){
        return ResponseEntity.status(200).body(productoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        productoService.deleteById(id);
        return ResponseEntity.status(204).build();
    }
}
