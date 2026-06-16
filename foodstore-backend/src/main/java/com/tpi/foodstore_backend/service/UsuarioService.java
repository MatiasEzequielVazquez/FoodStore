package com.tpi.foodstore_backend.service;

import com.tpi.foodstore_backend.dto.usuario.UsuarioCreate;
import com.tpi.foodstore_backend.dto.usuario.UsuarioDto;
import com.tpi.foodstore_backend.dto.usuario.UsuarioEdit;

import java.util.List;

public interface UsuarioService {
    UsuarioDto save(UsuarioCreate dto);
    List<UsuarioDto> findAll();
    UsuarioDto findById(Long id);
    UsuarioDto update(Long id, UsuarioEdit dto);
    void deleteById(Long id);
    UsuarioDto login(String email, String password);
}
