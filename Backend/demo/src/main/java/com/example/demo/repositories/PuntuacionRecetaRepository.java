package com.example.demo.repositories;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.PuntuacionReceta;

public interface PuntuacionRecetaRepository extends JpaRepository<PuntuacionReceta, Long> {

    Optional<PuntuacionReceta> findByUsuarioIdAndRecetaId(Long usuarioId, Long recetaId);

    List<PuntuacionReceta> findByRecetaId(Long recetaId);
    
    void deleteByRecetaId(Long recetaId);

}
