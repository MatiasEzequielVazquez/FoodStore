package com.tpi.foodstore_backend.service.impl;


import com.tpi.foodstore_backend.config.PasswordEncoder;
import com.tpi.foodstore_backend.dto.usuario.UsuarioCreate;
import com.tpi.foodstore_backend.dto.usuario.UsuarioDto;
import com.tpi.foodstore_backend.dto.usuario.UsuarioEdit;
import com.tpi.foodstore_backend.exception.BusinessException;
import com.tpi.foodstore_backend.model.Usuario;
import com.tpi.foodstore_backend.model.enums.Rol;
import com.tpi.foodstore_backend.repository.UsuarioRepository;
import com.tpi.foodstore_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;


    public UsuarioDto save(UsuarioCreate dto) {
        if (usuarioRepository.findByEmailAndEliminadoFalse(dto.email()).isPresent()) {
            throw new BusinessException("Ya existe un usuario con el email: " + dto.email());
        }
        Usuario usuario = Usuario.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .email(dto.email())
                .celular(dto.celular())
                .password(passwordEncoder.encode(dto.password()))
                .rol(Rol.USUARIO)
                .build();
        usuario = usuarioRepository.save(usuario);
        return new UsuarioDto(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getCelular(), usuario.getRol());
    }

    public List<UsuarioDto> findAll(){
        List<UsuarioDto> dtos = new ArrayList<>();
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario u : usuarios){
            dtos.add(new UsuarioDto(u.getId(), u.getNombre(), u.getApellido(), u.getEmail(), u.getCelular(), u.getRol()));
        }
        return dtos;
    }

    public UsuarioDto findById(Long id){
        Usuario usuario = usuarioRepository.findByIdOrThrow(id);
        return new UsuarioDto(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getCelular(), usuario.getRol());
    }

    public UsuarioDto update(Long id, UsuarioEdit dto){
        Usuario usuario = usuarioRepository.findByIdOrThrow(id);
        if (dto.nombre() != null) usuario.setNombre(dto.nombre());
        if (dto.apellido() != null) usuario.setApellido(dto.apellido());
        if (dto.email() != null) {
            if (usuarioRepository.findByEmailAndEliminadoFalse(dto.email()).isPresent()) {
                throw new BusinessException("Ya existe un usuario con el email: " + dto.email());
            }
            usuario.setEmail(dto.email());
        }
        if (dto.celular() != null) usuario.setCelular(dto.celular());
        if (dto.password() != null) usuario.setPassword(passwordEncoder.encode((dto.password())));
        usuarioRepository.save(usuario);
        return new UsuarioDto(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getCelular(), usuario.getRol());
    }

    public void deleteById(Long id){
        usuarioRepository.deleteById(id);
    }

    public UsuarioDto login(String email, String password){
        Usuario usuario = usuarioRepository.findByEmailAndEliminadoFalse(email).orElseThrow(() -> new BusinessException("Credenciales inválidas"));
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new BusinessException("Credenciales inválidas");
        }
        return new UsuarioDto(usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getEmail(), usuario.getCelular(), usuario.getRol());
    }
}
