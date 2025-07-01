package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Receta;
import com.example.demo.models.Usuario;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Integer> {
	List<Receta> findByNombreContainingIgnoreCase(String nombre);
	Optional<Receta> findById(int id);
	List<Receta> findByTipoIgnoreCase(String tipo);
	@Query("SELECT r FROM Receta r JOIN RecetaIngrediente ri ON r.id = ri.receta.id JOIN Ingrediente i ON ri.ingrediente.id = i.id WHERE LOWER(i.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
	List<Receta> findByIngredienteNombre(String nombre);
	List<Receta> findTop5ByOrderByFechaCreacionDesc();
	List<Receta> findByUsuario(Usuario usuario);
	List<Receta> findAllByOrderByNombreAsc();

}
