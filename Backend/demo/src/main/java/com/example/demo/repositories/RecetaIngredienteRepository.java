package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.RecetaIngrediente;

public interface RecetaIngredienteRepository extends JpaRepository<RecetaIngrediente, Integer> {
	List<RecetaIngrediente> findByRecetaId(int recetaId);

}
