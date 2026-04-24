package com.associados.associados.auth.controller;

import com.associados.associados.auth.dtos.request.LoginDto;
import com.associados.associados.auth.dtos.request.RegisterUserDto;
import com.associados.associados.auth.service.AuthService;
import com.associados.associados.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LoginDto data) {
        var response = authService.login(data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterUserDto data) {
        this.userService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}