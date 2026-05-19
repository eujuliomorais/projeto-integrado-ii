package com.associados.associados.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.auth.dtos.request.RegisterAdminDto;
import com.associados.associados.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Endpoints for registering and managing admin users")
public class AdminController {

    private final UserService userService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Register new admin", description = "Creates a new admin or consultant user (requires SUPER_ADMIN)")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Admin registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data or email already registered"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Void> registerAdmin(@RequestBody @Valid RegisterAdminDto data) {
        this.userService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/all-associates")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all associates", description = "Retrieves a list of all associates (requires ADMIN or SUPER_ADMIN)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of associates retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<List<Associate>> getAllAssociates() {
        List<Associate> associates = userService.getAllAssociates();
        return ResponseEntity.ok(associates);
    }
}
