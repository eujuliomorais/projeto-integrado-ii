package com.associados.associados.associate.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.associate.dtos.request.UpdateAssociateDto;
import com.associados.associados.associate.dtos.response.AssociateResponseDto;
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

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all associates", description = "Retrieves a paginated list of all registered associates")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Associates retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Page<AssociateResponseDto>> getAllAssociates(
            @RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 20);
        Page<AssociateResponseDto> associates = associateService.getAllAssociates(pageable);
        return ResponseEntity.ok(associates);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get associate details", description = "Retrieves complete information for a specific associate")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Associate retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Associate not found"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<AssociateResponseDto> getAssociateById(@PathVariable UUID id) {
        AssociateResponseDto associate = associateService.getAssociateById(id);
        return ResponseEntity.ok(associate);
    }

    @PatchMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update associate", description = "Updates one or more fields of an existing associate. Pass only the fields you want to update.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Associate updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data (CPF format, CPF already registered, etc)"),
        @ApiResponse(responseCode = "404", description = "Associate not found"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<AssociateResponseDto> updateAssociate(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateAssociateDto data) {
        AssociateResponseDto updated = associateService.updateAssociate(id, data);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete associate", description = "Permanently removes an associate and associated data from the system")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Associate deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Associate not found"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Void> deleteAssociate(@PathVariable UUID id) {
        associateService.deleteAssociate(id);
        return ResponseEntity.noContent().build();
    }
}
