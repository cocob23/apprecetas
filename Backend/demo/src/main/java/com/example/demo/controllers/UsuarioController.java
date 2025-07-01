package com.example.demo.controllers;


import java.util.List;
import java.util.Optional;

import com.example.demo.models.Usuario;
import com.example.demo.services.UsuarioService;
import com.example.demo.services.EmailService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	@Autowired
	UsuarioService usuarioService;
	@Autowired
	EmailService emailService;

	@GetMapping("/testmail")
	public String testMail() {
	    emailService.enviarCodigo("coticonrado03@gmail.com", "123456");
	    return "Intentado enviar";
	}
	@GetMapping("/ping")
	public String ping() {
	    return "pong";
	}
	
	@GetMapping("/todos")
	public List<Usuario> obtenerTodos(){
		return usuarioService.obtenerTodos();
	}
	
	@PostMapping("/recuperar")
	public ResponseEntity<?> iniciarRecuperacion(@RequestParam String mail) {
	    try {
	        String codigo = usuarioService.generarCodigoReset(mail);
	        return ResponseEntity.ok("Código enviado: " + codigo); // reemplazá con envío real
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}

	@PostMapping("/verificar")
	public ResponseEntity<?> verificarCodigo(@RequestParam String mail, @RequestParam String codigo) {
	    boolean valido = usuarioService.verificarCodigo(mail, codigo);
	    return valido ? ResponseEntity.ok("Código correcto") : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código incorrecto");
	}

	@PostMapping("/cambiar-clave")
	public ResponseEntity<?> cambiarClave(@RequestParam String mail, @RequestParam String nuevaClave) {
	    try {
	        usuarioService.cambiarClave(mail, nuevaClave);
	        return ResponseEntity.ok("Clave actualizada");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    }
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam String mail, @RequestParam String clave) {
	    Optional<Usuario> usuario = usuarioService.login(mail, clave);

	    if (usuario.isPresent()) {
	        return ResponseEntity.ok(usuario.get());
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
	    }
	}
	
	@PutMapping("/{id}/foto")
	public ResponseEntity<?> actualizarFoto(@PathVariable Long id, @RequestParam String url) {
	    Optional<Usuario> optionalUsuario = usuarioService.findById(id);
	    if (optionalUsuario.isPresent()) {
	        Usuario usuario = optionalUsuario.get();
	        usuario.setFotoPerfil(url);
	        usuarioService.guardar(usuario);
	        return ResponseEntity.ok("Foto de perfil actualizada");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	    }
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
	    Optional<Usuario> usuario = usuarioService.findById(id);
	    return usuario.isPresent() ? ResponseEntity.ok(usuario.get()) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	}

}
