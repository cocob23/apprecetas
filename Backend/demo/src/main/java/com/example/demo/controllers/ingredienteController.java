package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repositories.IngredienteRepository;
import com.example.demo.models.Ingrediente;
import com.example.demo.repositories.IngredienteRepository;

@RestController
@RequestMapping("/ingredientes")
public class ingredienteController {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    @GetMapping
    public List<Ingrediente> listarIngredientes() {
        return ingredienteRepository.findAll();
    }
    
    @PostMapping("/crear")
    public ResponseEntity<Ingrediente> crearIngrediente(@RequestBody Ingrediente ingrediente) {
        return ingredienteRepository.findByNombreIgnoreCase(ingrediente.getNombre())
            .map(ResponseEntity::ok)
            .orElseGet(() -> {
                Ingrediente nuevo = ingredienteRepository.save(ingrediente);
                return ResponseEntity.ok(nuevo);
            });
    }
}
