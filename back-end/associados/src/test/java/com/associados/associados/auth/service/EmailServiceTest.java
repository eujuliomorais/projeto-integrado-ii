package com.associados.associados.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.associados.associados.auth.infra.exceptions.BusinessException;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    @DisplayName("Should send email with correct parameters")
    void testSendPasswordResetEmailSuccess() {
        String to = "user@example.com";
        String token = "ABC-123";
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendPasswordResetEmail(to, token);

        verify(mailSender, times(1)).send(messageCaptor.capture());
        
        SimpleMailMessage sentMessage = messageCaptor.getValue();
        
        assertThat(sentMessage.getTo()).containsExactly(to);
        assertThat(sentMessage.getSubject()).isEqualTo("Password Recovery - Associates System");
        assertThat(sentMessage.getText()).contains(token);
        assertThat(sentMessage.getText()).contains("15 minutes");
    }

    @Test
    @DisplayName("Should throw BusinessException when mail sender fails")
    void testSendPasswordResetEmailFailure() {

        String to = "error@example.com";
        String token = "FAIL-TOKEN";
        
        doThrow(new MailSendException("SMTP server down"))
            .when(mailSender).send(any(SimpleMailMessage.class));

        assertThatThrownBy(() -> emailService.sendPasswordResetEmail(to, token))
            .isInstanceOf(BusinessException.class)
            .hasMessage("We could not send the recovery email. Please try again later.");
    }
}