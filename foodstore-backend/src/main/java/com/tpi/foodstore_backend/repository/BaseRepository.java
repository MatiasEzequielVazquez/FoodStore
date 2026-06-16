package com.tpi.foodstore_backend.repository;

import com.tpi.foodstore_backend.exception.ResourceNotFoundException;
import com.tpi.foodstore_backend.model.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<E extends Base, ID> extends JpaRepository<E, ID> {
    public List<E> findAllByEliminadoFalse();

    public Optional<E> findByIdAndEliminadoFalse(ID id);

    default List<E> findAll(){
        return findAllByEliminadoFalse();
    }

    default E findByIdOrThrow(ID id){
        return findByIdAndEliminadoFalse(id).orElseThrow(() -> new ResourceNotFoundException((Long) id));
    }

    default void deleteById(ID id){
        E entidad = findByIdOrThrow(id);
        entidad.setEliminado(true);
        save(entidad);
    }
}
