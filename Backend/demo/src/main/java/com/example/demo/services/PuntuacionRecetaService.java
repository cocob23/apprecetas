package com.example.demo.services;

import com.example.demo.models.PuntuacionReceta;
import com.example.demo.models.Receta;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.PuntuacionRecetaRepository;
import com.example.demo.repositories.RecetaRepository;
import com.example.demo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PuntuacionRecetaService {

    @Autowired
    private PuntuacionRecetaRepository puntuacionRecetaRepository;

    @Autowired
    private RecetaRepository recetaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void guardarOActualizarPuntuacion(int usuarioId, int recetaId, Integer puntuacion) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Receta receta = recetaRepository.findById(recetaId)
                .orElseThrow(() -> new RuntimeException("Receta no encontrada"));

        PuntuacionReceta existente = puntuacionRecetaRepository
                .findByUsuarioIdAndRecetaId(usuarioId, recetaId)
                .orElse(null);

        if (existente != null) {
            existente.setPuntuacion(puntuacion);
            puntuacionRecetaRepository.save(existente);
        } else {
            PuntuacionReceta nueva = new PuntuacionReceta();
            nueva.setUsuario(usuario);
            nueva.setReceta(receta);
            nueva.setPuntuacion(puntuacion);
            puntuacionRecetaRepository.save(nueva);
        }
    }

    public Double calcularPromedioPuntuacion(int recetaId) {
        List<PuntuacionReceta> puntuaciones = puntuacionRecetaRepository.findByRecetaId(recetaId);
        if (puntuaciones.isEmpty()) return 0.0;

        double total = puntuaciones.stream()
                .mapToInt(PuntuacionReceta::getPuntuacion)
                .sum();

        return total / puntuaciones.size();
    }

    public boolean yaPuntuo(int usuarioId, int recetaId) {
        return puntuacionRecetaRepository.findByUsuarioIdAndRecetaId(usuarioId, recetaId).isPresent();
    }
    
    public Integer obtenerPuntuacionPorUsuario(int recetaId, int usuarioId) {
        return puntuacionRecetaRepository.findByUsuarioIdAndRecetaId(usuarioId, recetaId)
                .map(PuntuacionReceta::getPuntuacion)
                .orElse(null);
    }
}