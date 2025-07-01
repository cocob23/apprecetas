package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.PasoDTO;
import com.example.demo.models.Paso;
import com.example.demo.models.Receta;
import com.example.demo.repositories.PasoRepository;
import com.example.demo.repositories.RecetaRepository;

@Service
public class PasoService {

    @Autowired
    PasoRepository pasoRepository;
    @Autowired
    private RecetaRepository recetaRepository;

    public List<Paso> obtenerPasosPorReceta(int recetaId) {
        return pasoRepository.findByRecetaIdOrderByNumeroAsc(recetaId);
    }
    
    public Paso agregarPasoDesdeDTO(PasoDTO dto) {
        Receta receta = recetaRepository.findById(dto.recetaId)
            .orElseThrow(() -> new RuntimeException("Receta no encontrada"));

        Paso paso = new Paso();
        paso.setReceta(receta);
        paso.setNumero(dto.numero);
        paso.setDescripcion(dto.descripcion);
        paso.setImagenUrl(dto.imagenUrl);
        paso.setVideoUrl(dto.videoUrl);

        return pasoRepository.save(paso);
    }
    
    public void eliminarPaso(int id) {
        if (!pasoRepository.existsById(id)) {
            throw new RuntimeException("Paso no encontrado");
        }
        pasoRepository.deleteById(id);
    }

    public Paso editarPaso(int id, Paso pasoActualizado) {
        Paso pasoExistente = pasoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paso no encontrado"));

        pasoExistente.setNumero(pasoActualizado.getNumero());
        pasoExistente.setDescripcion(pasoActualizado.getDescripcion());
        pasoExistente.setImagenUrl(pasoActualizado.getImagenUrl());
        pasoExistente.setVideoUrl(pasoActualizado.getVideoUrl());

        return pasoRepository.save(pasoExistente);
    }

}
