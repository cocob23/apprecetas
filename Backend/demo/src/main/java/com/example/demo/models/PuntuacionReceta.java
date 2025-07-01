package com.example.demo.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Entity
public class PuntuacionReceta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "receta_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Receta receta;

    private Integer puntuacion; // del 1 al 5

    public PuntuacionReceta() {}

    public PuntuacionReceta(Usuario usuario, Receta receta, Integer puntuacion) {
        this.usuario = usuario;
        this.receta = receta;
        this.puntuacion = puntuacion;
    }

    // Getters y setters

    public int getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Receta getReceta() {
        return receta;
    }

    public void setReceta(Receta receta) {
        this.receta = receta;
    }

    public Integer getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(Integer puntuacion) {
        this.puntuacion = puntuacion;
    }
}

