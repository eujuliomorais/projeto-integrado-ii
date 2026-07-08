package com.associados.associados.auth.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.message.MessageService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AssociateRepository associateRepository;

    @Autowired
    private MessageService messageService;

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Recuperação de Senha - Grupo Cultural de Dom Maurício";
        String body = "Olá!\n\nSeu código para recuperação de senha é: " + token +
                    "\n\nEste código expira em 15 minutos.";
        sendEmail(to, subject, body);
    }

    public void sendAssociateLoginEmail(String email, String token) {
        String subject = "Seu Código de Acesso - Grupo Cultural de Dom Maurício";
        String body = "Utilize o código abaixo para acessar o sistema: " + token +
                    "\n\nEste código expira em 10 minutos.";
        sendEmail(email, subject, body);
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.out.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String filename) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            helper.addAttachment(filename, new ByteArrayResource(attachment));
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            System.err.println("Error sending email with attachment: " + e.getMessage());
            throw new BusinessException("We could not send the email. Please try again later.");
        }
    }
    @Scheduled(cron = "0 0 8 * * *") // 8 da manha todo dia
    public void checkAndSendBirthdays() {
        System.out.println("Starting birthday check...");

        LocalDate hoje = LocalDate.now(ZoneId.of("America/Sao_Paulo"));
        int currentMonth = hoje.getMonthValue();
        int currentDay = hoje.getDayOfMonth();
        
        List<Associate> aniversariantes = associateRepository.findByBirthdayMonthAndDay(currentMonth, currentDay);
        
        for (Associate associado : aniversariantes) {
            
            if (associado.getUser() != null) {
                String email = associado.getUser().getEmail();
                String nome = associado.getUser().getName();
                
                sendBirthdayEmail(email, nome);
            }
        }

        System.out.println("Birthday check completed. Emails sent: " + aniversariantes.size());
    }

    public void sendBirthdayEmail(String to, String name) {
        String subject = "Grupo Cultural de Dom Maurício";
        String topoUrl = "https://lh3.googleusercontent.com/d/15NVc2eHIegUHcDhWdfM-hxvADdEII1JD"; 
        String rodapeUrl = "https://lh3.googleusercontent.com/d/1JMR_IIR0BbMJutuVQN8IB5yGVsHGDRJq"; 

        String personalizedMessage = messageService.getBirthdayMessage().replace("{name}", name);

        String body = "<!DOCTYPE html>"
                    + "<html lang=\"pt-BR\">"
                    + "<head><meta charset=\"UTF-8\"></head>"
                    + "<body style=\"margin: 0; padding: 0; width: 100% !important; background-color: #121212; font-family: Arial, sans-serif;\">"
                    + "    <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #121212; padding: 40px 10px;\">"
                    + "        <tr>"
                    + "            <td align=\"center\">"
                    + "                <table width=\"100%\" style=\"max-width: 550px; background-color: #ebe5cf; border-radius: 12px; overflow: hidden;\">"
                    + "                    <tr><td align=\"center\"><img src=\"" + topoUrl + "\" width=\"100%\"></td></tr>"
                    + "                    <tr>"
                    + "                        <td style=\"background-color: #ebe5cf; padding: 35px 40px; text-align: center;\">"
                    + "                            <h2 style=\"color: #000000 !important; font-size: 24px; margin-bottom: 20px;\">"
                    + "                                Querido(a) " + name + ","
                    + "                            </h2>"
                    + "                            <p style=\"color: #1a1a1a !important; font-size: 16px; line-height: 1.6; margin-bottom: 20px;\">"
                    + "                                " + personalizedMessage + "" 
                    + "                            </p>"
                    + "                            <p style=\"color: #1a1a1a !important; font-size: 15px; margin-bottom: 0;\">"
                    + "                                Att.,<br><strong>Grupo Cultural de Dom Maurício</strong>"
                    + "                            </p>"
                    + "                        </td>"
                    + "                    </tr>"
                    + "                    <tr><td align=\"center\"><img src=\"" + rodapeUrl + "\" width=\"100%\"></td></tr>"
                    + "                </table>"
                    + "            </td>"
                    + "        </tr>"
                    + "    </table>"
                    + "</body>"
                    + "</html>";

        sendEmail(to, subject, body); 
    }


}