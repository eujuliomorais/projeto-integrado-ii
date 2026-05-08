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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/associates")
@RequiredArgsConstructor
@Tag(name = "Associate Management", description = "Endpoints for registering new associates")
public class AssociateController {

    private final AssociateService associateService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Register new associate", description = "Creates a new associate user with complete profile information")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Associate registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data (CPF format, age < 18, email already registered)"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<MessageResponseDto> registerAssociate(@RequestBody @Valid RegisterAssociateDto data) {
        associateService.register(data);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponseDto("Associate registered successfully!"));
    }
}
