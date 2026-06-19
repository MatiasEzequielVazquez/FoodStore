package com.tpi.foodstore_backend.config;

import com.tpi.foodstore_backend.config.seed.CategoriaSeed;
import com.tpi.foodstore_backend.config.seed.ProductoSeed;
import com.tpi.foodstore_backend.model.Categoria;
import com.tpi.foodstore_backend.model.Producto;
import com.tpi.foodstore_backend.repository.CategoriaRepository;
import com.tpi.foodstore_backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
@RequiredArgsConstructor
public class DataLoad implements CommandLineRunner {
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public void run(String[] args) throws Exception {
        Map<String, Categoria> categorias = new HashMap<>();
        if (categoriaRepository.count() == 0) {
            List<CategoriaSeed> categoriasSeed = objectMapper.readValue(
                    new ClassPathResource("data/categorias.json").getInputStream(),
                    new TypeReference<List<CategoriaSeed>>() {}
            );
            for (CategoriaSeed seed : categoriasSeed) {
                Categoria categoria = Categoria.builder()
                        .nombre(seed.nombre())
                        .descripcion(seed.descripcion())
                        .build();
                categorias.put(seed.nombre(), categoriaRepository.save(categoria));
            }
        }
        if (productoRepository.count() == 0) {
            List<ProductoSeed> productosSeed = objectMapper.readValue(
                    new ClassPathResource("data/productos.json").getInputStream(),
                    new TypeReference<List<ProductoSeed>>() {}
            );
            for (ProductoSeed seed : productosSeed) {
                Producto producto = Producto.builder()
                        .nombre(seed.nombre())
                        .descripcion(seed.descripcion())
                        .precio(seed.precio())
                        .stock(seed.stock())
                        .imagen(seed.imagen())
                        .disponible(seed.disponible())
                        .categoria(categorias.get(seed.categoria().nombre()))
                        .build();
                productoRepository.save(producto);
            }
        }
    }
}
