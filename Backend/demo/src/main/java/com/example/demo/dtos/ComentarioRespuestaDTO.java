package com.example.demo.dtos;


import java.time.LocalDateTime;

public class ComentarioRespuestaDTO {
    public int id;
    public int usuarioId;
    public String aliasUsuario;
    public String nombreReceta;
    public String comentario;
    public LocalDateTime fecha;
    public Boolean aprobado;

    public ComentarioRespuestaDTO(int id, int usuarioId, String aliasUsuario, String nombreReceta, String comentario, LocalDateTime fecha, Boolean aprobado) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.aliasUsuario = aliasUsuario;
        this.nombreReceta = nombreReceta;
        this.comentario = comentario;
        this.fecha = fecha;
        this.aprobado = aprobado;
    }
}