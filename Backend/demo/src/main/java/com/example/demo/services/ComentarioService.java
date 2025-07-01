package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.ComentarioRespuestaDTO;
import com.example.demo.models.Comentario;
import com.example.demo.models.Receta;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.ComentarioRepository;
import com.example.demo.repositories.RecetaRepository;
import com.example.demo.repositories.UsuarioRepository;

@Service
public class ComentarioService {

    @Autowired
    ComentarioRepository comentarioRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    RecetaRepository recetaRepository;

    public ComentarioRespuestaDTO agregarComentario(int usuarioId, int recetaId, String texto) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Receta receta = recetaRepository.findById(recetaId).orElseThrow(() -> new RuntimeException("Receta no encontrada"));

        Comentario nuevo = new Comentario();
        nuevo.setUsuario(usuario);
        nuevo.setReceta(receta);
        nuevo.setComentario(texto);
        nuevo.setFecha(LocalDateTime.now());
        nuevo.setAprobado(true);


        comentarioRepository.save(nuevo);

        return new ComentarioRespuestaDTO(
            nuevo.getId(),
            usuario.getId(),
            usuario.getAlias(),
            receta.getNombre(),
            nuevo.getComentario(),
            nuevo.getFecha(),
            nuevo.getAprobado()
        );
    }


    public List<ComentarioRespuestaDTO> obtenerPendientes() {
        return comentarioRepository.findAll().stream()
            .filter(c -> !c.getAprobado())
            .map(c -> new ComentarioRespuestaDTO(
                c.getId(),
                c.getUsuario().getId(),
                c.getUsuario().getAlias(),
                c.getReceta().getNombre(),
                c.getComentario(),
                c.getFecha(),
                c.getAprobado()
            ))
            .toList();
    }

    public void aprobarComentario(int id) {
        Comentario c = comentarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        c.setAprobado(true);
        comentarioRepository.save(c);
    }

    public void eliminarComentario(int id) {
        comentarioRepository.deleteById(id);
    }
    

public List<ComentarioRespuestaDTO> obtenerAprobadosPorReceta(int recetaId) {
    List<Comentario> comentarios = comentarioRepository.findByRecetaIdAndAprobadoTrue(recetaId);
    return comentarios.stream()
    		.map(c -> new ComentarioRespuestaDTO(
    			c.getId(),
    	        c.getUsuario().getId(), // <- AGREGADO
    	        c.getUsuario().getAlias(),
    	        c.getReceta().getNombre(),
    	        c.getComentario(),
    	        c.getFecha(),
    	        c.getAprobado()
    	    ))
    	    .collect(Collectors.toList());
}
}
