package com.tpi.foodstore_backend.repository;

import com.tpi.foodstore_backend.model.Usuario;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndEliminadoFalse(String email);
}
