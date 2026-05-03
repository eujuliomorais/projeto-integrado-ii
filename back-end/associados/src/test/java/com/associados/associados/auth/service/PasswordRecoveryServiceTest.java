package com.associados.associados.auth.service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.auth.enums.TokenType;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.repository.AuthTokenRepository;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PasswordRecoveryServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordRecoveryService passwordRecoveryService;

    // createPasswordResetToken

    @Test
    @DisplayName("Should create token and send email successfully for Admin/Consultant")
    void testCreatePasswordResetTokenSuccess() {

        String email = "admin@test.com";
        ForgotPasswordRequestDto data = new ForgotPasswordRequestDto(email);
        User user = new User();
        user.setEmail(email);
        user.setRole(RoleEnum.ADMIN);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        passwordRecoveryService.createPasswordResetToken(data);

        verify(tokenRepository, times(1)).deleteByUserEmailAndType(email, TokenType.FORGOT_PASSWORD);
        verify(tokenRepository, times(1)).save(any(AuthToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq(email), anyString());
    }

    @Test
    @DisplayName("Should throw exception and not send email when user does not exist (Security Policy)")
    void testCreatePasswordResetTokenUserNotFound() {

        ForgotPasswordRequestDto data = new ForgotPasswordRequestDto("nonexistent@test.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> passwordRecoveryService.createPasswordResetToken(data))
                .isInstanceOf(BusinessException.class)
                .hasMessage("If the user exists, a recovery email has been sent.");

        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw exception when user role is ASSOCIATE")
    void testCreatePasswordResetTokenForAssociate() {

        String email = "associate@test.com";
        ForgotPasswordRequestDto data = new ForgotPasswordRequestDto(email);
        User user = new User();
        user.setEmail(email);
        user.setRole(RoleEnum.ASSOCIATE);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> passwordRecoveryService.createPasswordResetToken(data))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Associate access is performed via email token.");
        
        verify(tokenRepository, never()).save(any());
    }

    // reset password

    @Test
    @DisplayName("Should reset password successfully when token is valid")
    void testResetPasswordSuccess() {

        ResetPasswordDto data = new ResetPasswordDto("123456", "newPassword123");
        User user = new User();
        AuthToken authToken = new AuthToken();
        authToken.setUser(user);
        authToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        authToken.setUsed(false);

        when(tokenRepository.findByTokenAndType("123456", TokenType.FORGOT_PASSWORD))
                .thenReturn(Optional.of(authToken));
        when(passwordEncoder.encode(data.newPassword())).thenReturn("hashed_password");

        passwordRecoveryService.resetPassword(data);

        verify(userRepository, times(1)).save(user);
        verify(tokenRepository, times(1)).save(authToken);
        assert(user.getPassword().equals("hashed_password"));
        assert(authToken.isUsed());
    }

    @Test
    @DisplayName("Should throw exception when token is already used")
    void testResetPasswordTokenAlreadyUsed() {

        ResetPasswordDto data = new ResetPasswordDto("123456", "newPassword123");
        AuthToken authToken = new AuthToken();
        authToken.setUsed(true);
        authToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        when(tokenRepository.findByTokenAndType("123456", TokenType.FORGOT_PASSWORD))
                .thenReturn(Optional.of(authToken));

        assertThatThrownBy(() -> passwordRecoveryService.resetPassword(data))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Recovery token already used.");
    }

    @Test
    @DisplayName("Should throw exception when token is expired")
    void testResetPasswordTokenExpired() {

        ResetPasswordDto data = new ResetPasswordDto("123456", "password");
        AuthToken authToken = new AuthToken();
        authToken.setUsed(false);

        authToken.setExpiryDate(LocalDateTime.now().minusMinutes(1));

        when(tokenRepository.findByTokenAndType("123456", TokenType.FORGOT_PASSWORD))
                .thenReturn(Optional.of(authToken));

        assertThatThrownBy(() -> passwordRecoveryService.resetPassword(data))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Recovery token expired.");
    }
}