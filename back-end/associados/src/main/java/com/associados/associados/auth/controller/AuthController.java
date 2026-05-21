package com.associados.associados.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.AccessKeyLoginDto;
import com.associados.associados.auth.dtos.request.ConfirmPasswordResetDto;
import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.LoginAdminDto;
import com.associados.associados.auth.dtos.request.LoginAssociateDto;
import com.associados.associados.auth.dtos.request.LoginAssociateTokenDto;
import com.associados.associados.auth.dtos.request.ValidatePasswordTokenDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.dtos.response.MessageResponseDto;
import com.associados.associados.auth.dtos.response.TokenValidationResponseDto;
import com.associados.associados.auth.service.AssociateAuthService;
import com.associados.associados.auth.service.AuthService;
import com.associados.associados.auth.service.PasswordRecoveryService;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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

    @PostMapping("/access-manager/login")
    public ResponseEntity<LoginResponseDto> loginAccessManager(@RequestBody @Valid AccessKeyLoginDto data) {
        var response = authService.loginAccessManager(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<MessageResponseDto> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDto data) {
        recoveryService.createPasswordResetToken(data);
        return ResponseEntity.ok(new MessageResponseDto("If the user exists, a recovery email has been sent."));
    }

    @PostMapping("/password/validate")
    public ResponseEntity<TokenValidationResponseDto> validatePasswordToken(@RequestBody @Valid ValidatePasswordTokenDto data) {
        String resetToken = recoveryService.validatePasswordToken(data);
        return ResponseEntity.ok(new TokenValidationResponseDto("Token validated successfully.", true, resetToken));
    }

    @PostMapping("/password/reset")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<MessageResponseDto> resetPassword(
            @RequestHeader("Authorization") String authorization,
            @RequestBody @Valid ConfirmPasswordResetDto data) {
        recoveryService.confirmPasswordReset(recoverToken(authorization), data);
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

    @GetMapping("/profile")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserResponseDto> getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    private String recoverToken(String authorization) {
        return authorization.replace("Bearer ", "");
    }
}
