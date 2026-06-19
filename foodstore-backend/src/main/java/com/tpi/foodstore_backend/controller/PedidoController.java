package com.tpi.foodstore_backend.controller;

import com.tpi.foodstore_backend.dto.pedido.PedidoCreate;
import com.tpi.foodstore_backend.dto.pedido.PedidoDto;
import com.tpi.foodstore_backend.dto.pedido.PedidoEdit;
import com.tpi.foodstore_backend.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;


    @PostMapping
    public ResponseEntity<PedidoDto> save (@Valid @RequestBody PedidoCreate dto){
        return ResponseEntity.status(201).body(pedidoService.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<PedidoDto>> findAll(){
        return ResponseEntity.status(200).body(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> findById(@PathVariable Long id){
        return ResponseEntity.status(200).body(pedidoService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoDto>> findByUsuarioId(@PathVariable Long usuarioId){
        return ResponseEntity.status(200).body(pedidoService.findByUsuarioId(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> update(@PathVariable Long id, @Valid @RequestBody PedidoEdit dto){
        return ResponseEntity.status(200).body(pedidoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        pedidoService.deleteById(id);
        return ResponseEntity.status(204).build();
    }
}