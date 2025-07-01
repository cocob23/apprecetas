package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.ComentarioDTO;
import com.example.demo.dtos.ComentarioRespuestaDTO;
import com.example.demo.models.Comentario;
import com.example.demo.services.ComentarioService;

@RestController
@RequestMapping("/comentarios")
public class ComentarioController {

    @Autowired
    ComentarioService comentarioService;

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarComentario(@RequestBody ComentarioDTO dto) {
        try {
            ComentarioRespuestaDTO respuesta = comentarioService.agregarComentario(dto.usuarioId, dto.recetaId, dto.comentario);
            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pendientes")
    public List<ComentarioRespuestaDTO> pendientes() {
        return comentarioService.obtenerPendientes();
    }

    @PostMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Integer id) {
        comentarioService.aprobarComentario(id);
        return ResponseEntity.ok("Comentario aprobado");
    }

    @DeleteMapping("/{id}/eliminar")
    public ResponseEntity<?> eliminar(@PathVariable Integer id){
    	comentarioService.eliminarComentario(id);
    	return ResponseEntity.ok("Comentario eliminado");
    }
    
    @GetMapping("/aprobados")
    public ResponseEntity<?> comentariosAprobados(@RequestParam Integer recetaId) {
        List<ComentarioRespuestaDTO> comentarios = comentarioService.obtenerAprobadosPorReceta(recetaId);
        return ResponseEntity.ok(comentarios);
    }

}

