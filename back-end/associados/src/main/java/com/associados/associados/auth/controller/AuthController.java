package com.associados.associados.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.LoginDto;
import com.associados.associados.auth.dtos.request.RegisterUserDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.dtos.response.MessageResponseDto;
import com.associados.associados.auth.service.AuthService;
import com.associados.associados.auth.service.PasswordRecoveryService;
import com.associados.associados.user.service.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordRecoveryService recoveryService;

    @Autowired
    private UserService userService;
    
    //tipando as respostas do controller
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginDto data) {
        var response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterUserDto data) {
        this.userService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponseDto> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDto data) {
        recoveryService.createPasswordResetToken(data);
        return ResponseEntity.ok(new MessageResponseDto("If the user exists, a recovery email has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponseDto> resetPassword(@RequestBody @Valid ResetPasswordDto data) {
        recoveryService.resetPassword(data);
        return ResponseEntity.ok(new MessageResponseDto("Password changed successfully!"));
    }
}