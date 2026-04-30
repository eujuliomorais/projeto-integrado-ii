package com.associados.associados.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.infra.exceptions.BusinessException;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(to);
            email.setSubject("Password Recovery - Associates System");
            email.setText("Hello!\n\nYour password recovery code is: " + token + "\n\nThis code expires in 15 minutes.");
            
            mailSender.send(email);
        } catch (MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
            
            throw new BusinessException("We could not send the recovery email. Please try again later.");
        }
    }
}