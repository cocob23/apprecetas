package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Usuario;



public interface UsuarioRepository extends JpaRepository <Usuario, Integer>{
	Optional<Usuario> findByMail(String mail);
	Optional<Usuario> findByCodigoReset(String codigoReset);
	Optional<Usuario> findByMailAndClave(String mail, String clave);

}
