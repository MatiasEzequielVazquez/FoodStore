package com.tpi.foodstore_backend.config;

import com.tpi.foodstore_backend.model.Usuario;
import com.tpi.foodstore_backend.model.enums.Rol;
import com.tpi.foodstore_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserLoad implements CommandLineRunner {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String[] args) {
        if (usuarioRepository.count() == 0) {
            Usuario admin = Usuario.builder()
                    .nombre("admin")
                    .apellido("foodstore")
                    .email("admin@foodstore.com")
                    .password(passwordEncoder.encode("admin1234"))
                    .rol(Rol.ADMIN)
                    .build();

            usuarioRepository.save(admin);
        }
    }
}
