package com.tpi.foodstore_backend.controller;

import com.tpi.foodstore_backend.dto.usuario.UsuarioCreate;
import com.tpi.foodstore_backend.dto.usuario.UsuarioDto;
import com.tpi.foodstore_backend.dto.usuario.UsuarioEdit;
import com.tpi.foodstore_backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;


    @PostMapping
    public ResponseEntity<UsuarioDto> save (@Valid @RequestBody UsuarioCreate dto){
        return ResponseEntity.status(201).body(usuarioService.save(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@RequestParam String email, @RequestParam String password){
        return ResponseEntity.status(200).body(usuarioService.login(email, password));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> findAll(){
        return ResponseEntity.status(200).body(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> findById(@PathVariable Long id){
        return ResponseEntity.status(200).body(usuarioService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> update(@PathVariable Long id, @Valid @RequestBody UsuarioEdit dto){
        return ResponseEntity.status(200).body(usuarioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        usuarioService.deleteById(id);
        return ResponseEntity.status(204).build();
    }
}

