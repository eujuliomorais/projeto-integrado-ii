package com.associados.associados.user.controller;

import java.util.UUID;

import com.associados.associados.user.dtos.request.PatchUserEmailDto;
import com.associados.associados.user.dtos.request.PatchUserNameDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PatchMapping("/{id}/email")
    public ResponseEntity updateEmail(@PathVariable UUID id, @RequestBody @Valid PatchUserEmailDto data) {
        userService.updateEmail(id, data.email());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/name")
    public ResponseEntity updateName(@PathVariable UUID id, @RequestBody @Valid PatchUserNameDto data) {
        userService.updateName(id, data.name());
        return ResponseEntity.noContent().build();
    }
}
