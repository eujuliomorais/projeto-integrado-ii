package com.associados.associados.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.LoginAdminDto;
import com.associados.associados.auth.dtos.request.LoginAssociateDto;
import com.associados.associados.auth.dtos.request.LoginAssociateTokenDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.dtos.response.MessageResponseDto;
import com.associados.associados.auth.service.AssociateAuthService;
import com.associados.associados.auth.service.AuthService;
import com.associados.associados.auth.service.PasswordRecoveryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordRecoveryService recoveryService;
    private final AssociateAuthService associateAuthService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginAdminDto data) {
        var response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<MessageResponseDto> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDto data) {
        recoveryService.createPasswordResetToken(data);
        return ResponseEntity.ok(new MessageResponseDto("If the user exists, a recovery email has been sent."));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<MessageResponseDto> resetPassword(@RequestBody @Valid ResetPasswordDto data) {
        recoveryService.resetPassword(data);
        return ResponseEntity.ok(new MessageResponseDto("Password changed successfully!"));
    }

    @PostMapping("/magic-link/request")
    public ResponseEntity<MessageResponseDto> requestToken(@RequestBody @Valid LoginAssociateDto data) {
        associateAuthService.sendLoginToken(data.email());
        return ResponseEntity.ok(new MessageResponseDto("Code sent to the registered email address."));
    }

    @PostMapping("/magic-link/login")
    public ResponseEntity<LoginResponseDto> loginAssociate(@RequestBody @Valid LoginAssociateTokenDto data) {
        String token = associateAuthService.authenticateByToken(data.token());
        return ResponseEntity.ok(new LoginResponseDto(token, "Login successful!"));
    }
}