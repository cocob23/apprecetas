package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
	List<Comentario> findByRecetaIdAndAprobadoTrue(int recetaId);
	List<Comentario> findByUsuarioIdAndRecetaId(int usuarioId, int recetaId);


}
