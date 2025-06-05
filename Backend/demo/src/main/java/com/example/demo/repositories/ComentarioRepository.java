package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
	List<Comentario> findByRecetaIdAndAprobadoTrue(Long recetaId);
	List<Comentario> findByUsuarioIdAndRecetaId(Long usuarioId, Long recetaId);


}
