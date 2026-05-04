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
        String subject = "Password Recovery - Associates System";
        String body = "Hello!\n\nYour password recovery code is: " + token + "\n\nThis code expires in 15 minutes.";
        sendEmail(to, subject, body);
    }

    public void sendAssociateLoginEmail(String email, String token) {
        String subject = "Your Access Code - Associates Portal";
        String body = "Use the following code to access the system: " + token + 
                    "\nThis code expires in 10 minutes.";
        sendEmail(email, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(to);
            email.setSubject(subject);
            email.setText(body);
            mailSender.send(email);
        } catch (MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw new BusinessException("We could not send the email. Please try again later.");
        }
    }
}