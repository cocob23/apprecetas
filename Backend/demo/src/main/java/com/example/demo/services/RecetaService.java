package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import com.example.demo.models.Ingrediente;
import com.example.demo.models.Receta;
import com.example.demo.models.RecetaIngrediente;
import com.example.demo.models.Usuario;
import com.example.demo.models.LikeReceta;
import com.example.demo.repositories.IngredienteRepository;
import com.example.demo.repositories.LikeRecetaRepository;
import com.example.demo.repositories.PuntuacionRecetaRepository;
import com.example.demo.repositories.RecetaIngredienteRepository;
import com.example.demo.repositories.RecetaRepository;
import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.services.UsuarioService;

import jakarta.transaction.Transactional;
@Service
public class RecetaService {

    private final RecetaRepository recetaRepository;
    private final UsuarioRepository usuarioRepository;
    @Autowired
    private RecetaIngredienteRepository recetaIngredienteRepository;
    @Autowired
    private IngredienteRepository ingredienteRepository;
	private LikeRecetaRepository likeRecetaRepository;
	@Autowired
	private UsuarioService usuarioService;
	@Autowired
	private PuntuacionRecetaRepository puntuacionRecetaRepository;

    @Autowired
    public RecetaService(RecetaRepository recetaRepository, UsuarioRepository usuarioRepository, LikeRecetaRepository likeRecetaRepository) {
        this.recetaRepository = recetaRepository;
        this.usuarioRepository = usuarioRepository;
        this.likeRecetaRepository = likeRecetaRepository;
    }

    public Receta subirReceta(int usuarioId, String nombre, String descripcion, Integer porciones, String tipo, String imagenUrl) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("usuario no encontrado"));

        Receta nuevaReceta = new Receta();
        nuevaReceta.setUsuario(usuario);
        nuevaReceta.setNombre(nombre);
        nuevaReceta.setDescripcion(descripcion);
        nuevaReceta.setPorciones(porciones);
        nuevaReceta.setFechaCreacion(LocalDateTime.now());
        nuevaReceta.setAprobada(false);
        nuevaReceta.setTipo(tipo);
        nuevaReceta.setImagenUrl(imagenUrl); // <- NUEVO

        return recetaRepository.save(nuevaReceta);
    }
    
    public List<Receta> buscarPorNombre(String nombre) {
        return recetaRepository.findByNombreContainingIgnoreCase(nombre);
    }
    public Receta obtenerRecetaPorId(int id) {
        return recetaRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Receta no encontrada"));
    }
    public List<Receta> buscarPorTipo(String tipo) {
        return recetaRepository.findByTipoIgnoreCase(tipo);
    }
    
    public List<Receta> buscarConIngrediente(String nombre) {
        return recetaRepository.findByIngredienteNombre(nombre);
    }

    
    public RecetaIngrediente agregarIngrediente(int recetaId, int ingredienteId, String cantidad) {
        Receta receta = recetaRepository.findById(recetaId)
                .orElseThrow(() -> new NoSuchElementException("Receta no encontrada"));

        Ingrediente ingrediente = ingredienteRepository.findById(ingredienteId)
                .orElseThrow(() -> new NoSuchElementException("Ingrediente no encontrado"));

        RecetaIngrediente ri = new RecetaIngrediente();
        ri.setReceta(receta);
        ri.setIngrediente(ingrediente);
        ri.setCantidad(cantidad);

        return recetaIngredienteRepository.save(ri);
    }
    
    public List<Receta> obtenerRecetasMasRecientes() {
        return recetaRepository.findTop5ByOrderByFechaCreacionDesc();
    }

    public void darLike(int usuarioId, int recetaId) {
        Receta receta = recetaRepository.findById(recetaId)
            .orElseThrow(() -> new NoSuchElementException("Receta no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        if (likeRecetaRepository.existsByUsuarioAndReceta(usuario, receta)) {
            return; 
        }

        LikeReceta like = new LikeReceta();
        like.setReceta(receta);
        like.setUsuario(usuario);
        likeRecetaRepository.save(like);
    }
    
    public LikeReceta encontrarLikePorUsuarioYReceta(Usuario usuario, Receta receta) {
        return likeRecetaRepository.findByUsuarioAndReceta(usuario, receta)
            .orElseThrow(() -> new RuntimeException("Like no encontrado"));
    }

    public void eliminarLike(LikeReceta like) {
        likeRecetaRepository.delete(like);
    }


    public long contarLikes(int recetaId) {
        Receta receta = recetaRepository.findById(recetaId).orElseThrow();
        return likeRecetaRepository.countByReceta(receta);
    }
    
    @Transactional
    public void eliminarReceta(int id) {
        Receta receta = recetaRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Receta no encontrada"));

        puntuacionRecetaRepository.deleteByRecetaId(id); // 💥 esto elimina las puntuaciones
        recetaRepository.delete(receta); // ahora sí, podés eliminar la receta
    }
    
    public Receta editarReceta(int id, Receta datosNuevos) {
        Receta receta = recetaRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Receta no encontrada"));

        receta.setNombre(datosNuevos.getNombre());
        receta.setDescripcion(datosNuevos.getDescripcion());
        receta.setPorciones(datosNuevos.getPorciones());
        receta.setTipo(datosNuevos.getTipo());

        return recetaRepository.save(receta);
    }
    
    public Receta guardarReceta(Receta receta) {
        return recetaRepository.save(receta);
    }
    
    public boolean existeLike(Usuario usuario, Receta receta) {
        return likeRecetaRepository.existsByUsuarioAndReceta(usuario, receta);
    }

    public List<Receta> obtenerRecetasDelUsuario(int usuarioId) {
        Usuario usuario = usuarioService.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return recetaRepository.findByUsuario(usuario);
    }

    public List<Receta> buscarPorIngredientes(List<Integer> ids, boolean incluir) {
        List<RecetaIngrediente> relaciones = recetaIngredienteRepository.findAll();


        return relaciones.stream()
            .collect(Collectors.groupingBy(ri -> ri.getReceta()))
            .entrySet().stream()
            .filter(entry -> {
                List<Integer> idsEnReceta = entry.getValue().stream()
                    .map(ri -> ri.getIngrediente().getId())
                    .collect(Collectors.toList());

                if (incluir) {
                    return idsEnReceta.containsAll(ids);
                } else {
                    return idsEnReceta.stream().noneMatch(ids::contains);
                }
            })
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

}
