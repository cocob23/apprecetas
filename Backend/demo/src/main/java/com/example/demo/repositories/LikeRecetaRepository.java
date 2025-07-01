package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.LikeReceta;
import com.example.demo.models.Receta;
import com.example.demo.models.Usuario;

public interface LikeRecetaRepository extends JpaRepository<LikeReceta, Integer> {
    boolean existsByUsuarioAndReceta(Usuario usuario, Receta receta);
    long countByReceta(Receta receta);
    void deleteByUsuarioAndReceta(Usuario usuario, Receta receta);
    Optional<LikeReceta> findByUsuarioAndReceta(Usuario usuario, Receta receta);

}
