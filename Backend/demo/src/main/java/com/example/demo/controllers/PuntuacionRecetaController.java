package com.example.demo.controllers;

import com.example.demo.services.PuntuacionRecetaService;
import com.example.demo.models.PuntuacionReceta;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/puntuaciones")
public class PuntuacionRecetaController {

    @Autowired
    private PuntuacionRecetaService puntuacionRecetaService;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarPuntuacion(
        @RequestParam Integer usuarioId,
        @RequestParam Integer recetaId,
        @RequestParam Integer puntuacion
    ) {
        try {
            puntuacionRecetaService.guardarOActualizarPuntuacion(usuarioId, recetaId, puntuacion);  // FIX
            return ResponseEntity.ok("Puntuación guardada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar puntuación: " + e.getMessage());
        }
    }

    @GetMapping("/promedio")
    public ResponseEntity<Double> obtenerPromedio(@RequestParam Integer recetaId) {
        double promedio = puntuacionRecetaService.calcularPromedioPuntuacion(recetaId);
        return ResponseEntity.ok(promedio);
    }

    @GetMapping("/usuario")
    public ResponseEntity<Integer> obtenerPuntuacionUsuario(
        @RequestParam Integer usuarioId,
        @RequestParam Integer recetaId
    ) {
        Integer puntuacion = puntuacionRecetaService.obtenerPuntuacionPorUsuario(recetaId, usuarioId);
        return ResponseEntity.ok(puntuacion);
    }
}