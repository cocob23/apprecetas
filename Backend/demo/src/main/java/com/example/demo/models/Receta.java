package com.example.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "recetas") // opcional, si la tabla tiene otro nombre en la db
public class Receta {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "imagen_url")
    private String imagenUrl;
    
    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(columnDefinition="TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Integer porciones;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(nullable = false)
    private String tipo;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean aprobada = false;
    
    @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RecetaIngrediente> ingredientes;

    public Receta(int id, Usuario usuario, String imageUrl,String nombre, String descripcion, Integer porciones, LocalDateTime fechaCreacion, Boolean aprobada) {
        this.id = id;
        this.usuario = usuario;
        this.imagenUrl = imagenUrl;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.porciones = porciones;
        this.fechaCreacion = fechaCreacion;
        this.aprobada = aprobada;
        this.tipo = tipo;
    }
    
    public Receta() {
        // constructor vacío necesario para JPA
    }

    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public Usuario getUsuario() {return usuario;}
    public void setUsuario(Usuario usuario) {this.usuario = usuario;}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getPorciones() { return porciones; }
    public void setPorciones(Integer porciones) { this.porciones = porciones; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Boolean getAprobada() { return aprobada; }
    public void setAprobada(Boolean aprobada) { this.aprobada = aprobada; }
    
    public String getTipo() {return tipo;}
    public void setTipo(String tipo) {this.tipo = tipo;}
    
    public List<RecetaIngrediente> getIngredientes() {return ingredientes;}
    public void setIngredientes(List<RecetaIngrediente> ingredientes) {this.ingredientes = ingredientes;}
    
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
