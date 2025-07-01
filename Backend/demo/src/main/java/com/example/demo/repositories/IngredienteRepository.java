package com.example.demo.repositories;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Ingrediente;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Integer> {
	Optional<Ingrediente> findByNombreIgnoreCase(String nombre);

}
