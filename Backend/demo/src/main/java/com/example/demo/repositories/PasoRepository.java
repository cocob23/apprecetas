package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Paso;

public interface PasoRepository extends JpaRepository<Paso, Integer>{
	List<Paso> findByRecetaIdOrderByNumeroAsc(int recetaId);
}
