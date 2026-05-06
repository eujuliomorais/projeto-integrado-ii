package com.associados.associados.associate.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.associate.service.AssociateService;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.auth.dtos.response.MessageResponseDto;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/associates")
@RequiredArgsConstructor
public class AssociateController {

    private final AssociateService associateService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<MessageResponseDto> registerAssociate(@RequestBody @Valid RegisterAssociateDto data) {
        associateService.register(data);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponseDto("Associate registered successfully!"));
    }
}