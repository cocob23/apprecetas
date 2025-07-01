package com.example.demo.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.example.demo.services.RecetaService;
import com.example.demo.services.UsuarioService;

import ch.qos.logback.core.joran.spi.HttpUtil.RequestMethod;

import com.example.demo.dtos.RecetaIngredienteDTO;
import com.example.demo.models.LikeReceta;
import com.example.demo.models.Receta;
import com.example.demo.models.RecetaIngrediente;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.RecetaIngredienteRepository;
import com.example.demo.repositories.RecetaRepository;

@RestController
@RequestMapping("/recetas")
public class RecetaController {
	@Autowired
	RecetaService recetaService;
	@Autowired
	UsuarioService usuarioService;
	@Autowired 
	RecetaIngredienteRepository recetaIngredienteRepository;
	@Autowired
	RecetaRepository recetaRepository;
	
	@PostMapping("/subir")
	public ResponseEntity<?> subirReceta(@RequestParam int usuarioId, @RequestBody Receta receta) {
	    try {
	        Receta nuevaReceta = recetaService.subirReceta(
	            usuarioId,
	            receta.getNombre(),
	            receta.getDescripcion(),
	            receta.getPorciones(),
	            receta.getTipo(),
	            receta.getImagenUrl() // <- NUEVO
	        );
	        return new ResponseEntity<>(nuevaReceta, HttpStatus.CREATED);
	    } catch (IllegalArgumentException e) {
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}
	@GetMapping("/buscar")
	public ResponseEntity<?> buscarRecetasPorNombre(@RequestParam String nombre) {
	    List<Receta> recetas = recetaService.buscarPorNombre(nombre);
	    return new ResponseEntity<>(recetas, HttpStatus.OK);
	}
	@GetMapping("/{id}")
	public ResponseEntity<?> getRecetaPorId(@PathVariable Integer id) {
	    try {
	        Receta receta = recetaService.obtenerRecetaPorId(id);
	        return ResponseEntity.ok(receta);
	    } catch (NoSuchElementException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}
	@GetMapping("/tipo/{tipo}")
	public ResponseEntity<?> buscarPorTipo(@PathVariable String tipo) {
	    List<Receta> recetas = recetaService.buscarPorTipo(tipo);
	    return ResponseEntity.ok(recetas);
	}
	
	@PostMapping("/agregar-ingrediente")
	public ResponseEntity<?> agregarIngrediente(@RequestBody RecetaIngredienteDTO dto) {
	    try {
	        RecetaIngrediente resultado = recetaService.agregarIngrediente(
	            dto.recetaId, dto.ingredienteId, dto.cantidad
	        );
	        return ResponseEntity.ok(resultado);
	    } catch (NoSuchElementException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}
	
	@GetMapping("/con-ingrediente")
	public ResponseEntity<?> recetasConIngrediente(@RequestParam String name) {
	    List<Receta> recetas = recetaService.buscarConIngrediente(name);
	    return recetas.isEmpty()
	        ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron recetas con ese ingrediente.")
	        : ResponseEntity.ok(recetas);
	}

	@GetMapping("/recientes")
	public ResponseEntity<List<Receta>> obtenerRecientes() {
	    List<Receta> recetas = recetaService.obtenerRecetasMasRecientes();
	    return ResponseEntity.ok(recetas);
	}
	
	@PostMapping("/{id}/like")
	public ResponseEntity<?> darLike(@PathVariable Integer id, @RequestParam Integer usuarioId) {
		recetaService.darLike(usuarioId, id); 
	    return ResponseEntity.ok("Like registrado");
	}
	
	@DeleteMapping("/{id}/dislike")
	public ResponseEntity<?> quitarLike(@PathVariable Integer id, @RequestParam Integer usuarioId) {
	    try {
	        Usuario usuario = usuarioService.findById(usuarioId)
	            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

	        Receta receta = recetaService.obtenerRecetaPorId(id);

	        LikeReceta like = recetaService.encontrarLikePorUsuarioYReceta(usuario, receta);
	        recetaService.eliminarLike(like);

	        return ResponseEntity.ok("Like eliminado");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}


	@GetMapping("/{id}/likes")
	public ResponseEntity<?> contarLikes(@PathVariable Integer id) {
	    long cantidad = recetaService.contarLikes(id);
	    return ResponseEntity.ok(cantidad);
	}
	
	@GetMapping("/{id}/liked")
	public ResponseEntity<Boolean> yaLeDioLike(@PathVariable Integer id, @RequestParam Integer usuarioId) {
	    Usuario usuario = usuarioService.findById(usuarioId)
	        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
	    Receta receta = recetaService.obtenerRecetaPorId(id);
	    boolean existe = recetaService.existeLike(usuario, receta);
	    return ResponseEntity.ok(existe);
	}
	
	@DeleteMapping("/{id}/eliminar")
	public ResponseEntity<?> eliminarReceta(@PathVariable Integer id) {
	    try {
	        recetaService.eliminarReceta(id);
	        return ResponseEntity.ok("Receta eliminada con éxito");
	    } catch (NoSuchElementException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}
	
	@PutMapping("/editar/{id}")
	public ResponseEntity<?> editarRecetaPut(
	        @PathVariable Integer id,
	        @RequestParam Integer usuarioId,
	        @RequestBody Receta recetaActualizada
	) {
	    try {
	        Receta receta = recetaService.obtenerRecetaPorId(id);

	        if (!Integer.valueOf(receta.getUsuario().getId()).equals(usuarioId)) {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tenés permiso para editar esta receta.");
	        }

	        receta.setNombre(recetaActualizada.getNombre());
	        receta.setDescripcion(recetaActualizada.getDescripcion());
	        receta.setPorciones(recetaActualizada.getPorciones());
	        receta.setTipo(recetaActualizada.getTipo());

	        recetaService.guardarReceta(receta);
	        return ResponseEntity.ok("Receta actualizada");
	    } catch (NoSuchElementException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receta no encontrada");
	    }
	}
	
	@GetMapping("/mias")
	public ResponseEntity<?> recetasDelUsuario(@RequestParam Integer usuarioId) {
	    try {
	        List<Receta> recetas = recetaService.obtenerRecetasDelUsuario(usuarioId);
	        return ResponseEntity.ok(recetas);
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
	    }
	}
	@GetMapping("/{id}/ingredientes")
	public List<Map<String, String>> obtenerIngredientesDeReceta(@PathVariable Integer id) {
	    List<RecetaIngrediente> lista = recetaIngredienteRepository.findByRecetaId(id);
	    return lista.stream().map(ri -> {
	        Map<String, String> map = new HashMap<>();
	        map.put("nombre", ri.getIngrediente().getNombre());
	        map.put("cantidad", ri.getCantidad());
	        return map;
	    }).collect(Collectors.toList());
	}
	
	@GetMapping("/ordenadas")
	public List<Receta> listarOrdenadas(@RequestParam String criterio) {
	    if (criterio.equalsIgnoreCase("alfabetico")) {
	        return recetaRepository.findAllByOrderByNombreAsc();
	    }
	    return recetaRepository.findAll();
	}

	@GetMapping("/no-contienen")
	public ResponseEntity<List<Receta>> buscarPorIngredientesExcluidos(@RequestParam List<Integer> ids) {
	    List<Receta> recetas = recetaService.buscarPorIngredientes(ids, false);
	    return ResponseEntity.ok(recetas);
	}

	@GetMapping("/contienen")
	public ResponseEntity<List<Receta>> buscarPorIngredientesIncluidos(@RequestParam List<Integer> ids) {
	    List<Receta> recetas = recetaService.buscarPorIngredientes(ids, true);
	    return ResponseEntity.ok(recetas);
	}
}
