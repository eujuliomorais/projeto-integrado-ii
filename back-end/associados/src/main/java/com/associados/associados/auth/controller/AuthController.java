package com.associados.associados.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.LoginDto;
import com.associados.associados.auth.dtos.request.RegisterAssociateRequest;
import com.associados.associados.auth.dtos.request.RegisterManagementUserDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.service.AuthService;
import com.associados.associados.user.dtos.request.PatchUserEmailDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginDto data) throws Exception {
        var response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/admin")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Register new admin", description = "Creates a new admin user")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Admin registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<?> registerSuperAdmin(@RequestBody @Valid RegisterManagementUserDto data) throws Exception {
        authService.createAdminOrConsultantUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/register/associate")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Associate registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data (CPF format, age < 18, email already registered)"),
        @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @Operation(summary = "Register new associate", description = "Creates a new associate user with complete profile information")
    public ResponseEntity<String> registerAssociate(@RequestBody @Valid RegisterAssociateRequest request) throws Exception {
        authService.createAssociateUser(request.managementData(), request.userData());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Associate registered successfully!");
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify user", description = "Verifies a user's email address")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User verified successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid verification code or email")
    })
    public ResponseEntity<?> verifyUser(@RequestParam String email, @RequestParam String code) {
        try {
            authService.verifyUser(email, code);
            return ResponseEntity.ok("User verified successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/password/forgot")
    @Operation(summary = "Request password reset", description = "Requests a password reset for a user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password reset requested successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid email")
    })
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid PatchUserEmailDto email) throws Exception {
        authService.requestPasswordReset(email);
        return ResponseEntity.ok("If the user exists, a recovery email has been sent.");
    }

    @PostMapping("/password/reset")
    @Operation(summary = "Reset password", description = "Resets a user's password")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDto data) throws Exception {
        authService.resetPassword(data);
        return ResponseEntity.ok("Password changed successfully!");
    }

}
