package com.example.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Usuario;
import com.example.demo.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private EmailService emailService;


    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // 🔐 Generar código de verificación
    public String generarCodigoReset(String mail) {
        Optional<Usuario> optUsuario = usuarioRepository.findByMail(mail);
        if (optUsuario.isEmpty()) throw new RuntimeException("Usuario no encontrado");

        Usuario u = optUsuario.get();
        String codigo = String.format("%06d", new Random().nextInt(999999));
        u.setCodigoReset(codigo);
        usuarioRepository.save(u);

        // Debería enviarse por correo, por ahora solo se devuelve para pruebas
     // return codigo;
        emailService.enviarCodigo(mail, codigo);
        return "Código enviado al mail"; // opcional

    }

    // ✅ Verificar si el código ingresado es correcto
    public boolean verificarCodigo(String mail, String codigo) {
        Optional<Usuario> optUsuario = usuarioRepository.findByMail(mail);
        return optUsuario.isPresent() && codigo.equals(optUsuario.get().getCodigoReset());
    }

    // 🔄 Cambiar la contraseña
    public void cambiarClave(String mail, String nuevaClave) {
        Usuario u = usuarioRepository.findByMail(mail).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setClave(nuevaClave); // Ideal: hashearla
        u.setCodigoReset(null); // Limpieza del código usado
        usuarioRepository.save(u);
    }
    
    public Optional<Usuario> login(String mail, String clave) {
        return usuarioRepository.findByMailAndClave(mail, clave);
    }

    public Optional<Usuario> findById(int id) {
        return usuarioRepository.findById(id);
    }
    
    public void guardar(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

}
