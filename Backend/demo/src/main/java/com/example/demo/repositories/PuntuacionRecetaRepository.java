package com.example.demo.repositories;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.PuntuacionReceta;

public interface PuntuacionRecetaRepository extends JpaRepository<PuntuacionReceta, Integer> {

    Optional<PuntuacionReceta> findByUsuarioIdAndRecetaId(int usuarioId, int recetaId);

    List<PuntuacionReceta> findByRecetaId(int recetaId);
    
    void deleteByRecetaId(int recetaId);

}
