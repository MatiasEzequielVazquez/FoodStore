package com.tpi.foodstore_backend.service.impl;

import com.tpi.foodstore_backend.dto.categoria.CategoriaDto;
import com.tpi.foodstore_backend.dto.producto.ProductoCreate;
import com.tpi.foodstore_backend.dto.producto.ProductoDto;
import com.tpi.foodstore_backend.dto.producto.ProductoEdit;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.model.Producto;
import com.tpi.foodstore_backend.repository.CategoriaRepository;
import com.tpi.foodstore_backend.repository.ProductoRepository;
import com.tpi.foodstore_backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;


    public ProductoDto save(ProductoCreate dto) {
        Categoria categoria = categoriaRepository.findByIdOrThrow(dto.idCategoria());
        Producto producto = Producto.builder()
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .precio(dto.precio())
                .stock(dto.stock())
                .imagen(dto.imagen())
                .disponible(dto.disponible())
                .categoria(categoria)
                .build();
        producto = productoRepository.save(producto);
        CategoriaDto categoriaDto = new CategoriaDto(producto.getCategoria().getId(), producto.getCategoria().getNombre(), producto.getCategoria().getDescripcion());
        return new ProductoDto(producto.getId(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(), producto.getStock(), producto.getImagen(), producto.isDisponible(), categoriaDto);
    }

    public List<ProductoDto> findAll(){
        List<ProductoDto> dtos = new ArrayList<>();
        List<Producto> productos = productoRepository.findAll();
        for (Producto p : productos){
            CategoriaDto categoriaDto = new CategoriaDto(p.getCategoria().getId(), p.getCategoria().getNombre(), p.getCategoria().getDescripcion());
            dtos.add(new ProductoDto(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(), p.getStock(), p.getImagen(), p.isDisponible(), categoriaDto));
        }
        return dtos;
    }

    public ProductoDto findById(Long id){
        Producto producto = productoRepository.findByIdOrThrow(id);
        CategoriaDto categoriaDto = new CategoriaDto(producto.getCategoria().getId(), producto.getCategoria().getNombre(), producto.getCategoria().getDescripcion());
        return new ProductoDto(producto.getId(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(), producto.getStock(), producto.getImagen(), producto.isDisponible(), categoriaDto);
    }

    public List<ProductoDto> findByCategoriaId(Long categoriaId){
        categoriaRepository.findByIdOrThrow(categoriaId);
        List<Producto> productos = productoRepository.findAllByCategoriaIdAndEliminadoFalse(categoriaId);
        List<ProductoDto> dtos = new ArrayList<>();
        for (Producto p : productos){
            CategoriaDto categoriaDto = new CategoriaDto(p.getCategoria().getId(), p.getCategoria().getNombre(), p.getCategoria().getDescripcion());
            dtos.add(new ProductoDto(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(), p.getStock(), p.getImagen(), p.isDisponible(), categoriaDto));
        }
        return dtos;
    }

    public ProductoDto update(Long id, ProductoEdit dto){
        Producto producto = productoRepository.findByIdOrThrow(id);
        if (dto.nombre() != null) producto.setNombre(dto.nombre());
        if (dto.descripcion() != null) producto.setDescripcion(dto.descripcion());
        if (dto.precio() != null && dto.precio().compareTo(new BigDecimal("0.01")) >= 0) {producto.setPrecio(dto.precio());}
        if (dto.stock() != null && dto.stock() >= 0) {producto.setStock(dto.stock());}
        if (dto.imagen() != null) producto.setImagen(dto.imagen());
        producto.setDisponible(dto.disponible());
        if (dto.idCategoria() != null){
            Categoria categoria = categoriaRepository.findByIdOrThrow(dto.idCategoria());
            producto.setCategoria(categoria);
        }
        productoRepository.save(producto);
        CategoriaDto categoriaDto = new CategoriaDto(producto.getCategoria().getId(), producto.getCategoria().getNombre(), producto.getCategoria().getDescripcion());
        return new ProductoDto(producto.getId(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(), producto.getStock(), producto.getImagen(), producto.isDisponible(), categoriaDto);
    }

    public void deleteById(Long id){
        productoRepository.deleteById(id);
    }

}