package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.PasoDTO;
import com.example.demo.models.Paso;
import com.example.demo.services.PasoService;

@RestController
@RequestMapping("/pasos")
public class PasoController {

    @Autowired
    PasoService pasoService;
    
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarPaso(@RequestBody PasoDTO pasoDTO) {
        try {
            Paso guardado = pasoService.agregarPasoDesdeDTO(pasoDTO);
            return ResponseEntity.ok(guardado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/por-receta")
    public ResponseEntity<?> pasosPorReceta(@RequestParam Integer recetaId) {
        return ResponseEntity.ok(pasoService.obtenerPasosPorReceta(recetaId));
    }
    
    @DeleteMapping("/{id}/eliminar")
    public ResponseEntity<?> eliminarPaso(@PathVariable Integer id) {
        try {
            pasoService.eliminarPaso(id);
            return ResponseEntity.ok("Paso eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/editar")
    public ResponseEntity<?> editarPaso(@PathVariable Integer id, @RequestBody Paso pasoActualizado) {
        try {
            Paso actualizado = pasoService.editarPaso(id, pasoActualizado);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}