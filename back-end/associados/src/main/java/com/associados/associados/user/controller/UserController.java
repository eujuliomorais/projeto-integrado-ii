package com.associados.associados.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.auth.dtos.request.RegisterAssociateRequest;
import com.associados.associados.auth.dtos.request.RegisterManagementUserDto;
import com.associados.associados.user.dtos.response.UserCompleteResponseDto;
import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Role;
import com.associados.associados.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/users")
@Tag(name = "UserController", description = "Endpoints for managing users in the system")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all users", description = "Return a list of all users in the system")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "No users found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<UserCompleteResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Return a single user by their unique ID")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<UserCompleteResponseDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email", description = "Return a single user by their unique email address")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<UserCompleteResponseDto> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get users by category", description = "Return a list of users filtered by their category")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "No users found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<UserCompleteResponseDto>> getUsersByCategory(@PathVariable CategoryEnum category) {
        return ResponseEntity.ok(userService.getUsersByCategory(category));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID", description = "Remove a user from the system by their unique ID")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Successfully deleted user"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Void> deleteUserById(@PathVariable UUID id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/role")
    @Operation(summary = "Update user role", description = "Change the role of a user by their email address")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully updated user role"),
        @ApiResponse(responseCode = "500", description = "Internal server error"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Void> patchUserRole(@RequestParam String email, @RequestParam Role newRole) {
        userService.patchUserRole(email, newRole);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/update-admin")
    @Operation(summary = "Update admin user", description = "Update the information of an existing admin user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> updateAdmin(@RequestBody @Valid RegisterManagementUserDto data) {
        userService.updateUserAdmin(data);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-associate")
    @Operation(summary = "Update associate user", description = "Update the information of an existing associate user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> updateAssociate(@RequestBody @Valid RegisterAssociateRequest data) {
        userService.updateUserAssociate(data);
        return ResponseEntity.ok().build();
    }

}
