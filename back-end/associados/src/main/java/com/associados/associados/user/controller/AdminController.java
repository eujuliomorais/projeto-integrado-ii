package com.associados.associados.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.RegisterAdminDto;
import com.associados.associados.user.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> registerAdmin(@RequestBody @Valid RegisterAdminDto data) {
        this.userService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}