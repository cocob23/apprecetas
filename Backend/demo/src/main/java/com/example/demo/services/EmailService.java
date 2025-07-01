package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigo(String to, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("MS_11OIid@test-z0vklo67n9pl7qrx.mlsender.net");
        message.setTo(to);
        message.setSubject("Recuperación de contraseña");
        message.setText("Tu código de recuperación es: " + codigo);
        mailSender.send(message);
    }
}
