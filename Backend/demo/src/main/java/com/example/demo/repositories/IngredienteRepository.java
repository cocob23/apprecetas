package com.example.demo.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Ingrediente;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {

}
