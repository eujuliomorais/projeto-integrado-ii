package com.associados.associados.user.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.associados.associados.user.dtos.request.ToggleActiveDto;
import com.associados.associados.user.dtos.request.UpdateProfileDto;
import com.associados.associados.user.dtos.request.UpdateUserRoleDto;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.service.AccessManagementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/management/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing user accounts, roles, and permissions")
public class AccessManagementController {

    private final AccessManagementService accessManagementService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all users", description = "Lists all users (SUPER_ADMIN sees all, ADMIN sees only ASSOCIATES)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Users listed successfully"),
        @ApiResponse(responseCode = "403", description = "User lacks permission to list users")
    })
    public ResponseEntity<Page<UserResponseDto>> listUsers(Pageable pageable) {
        UUID requesterId = getAuthenticatedUserId();
        var users = accessManagementService.listUsers(requesterId, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user details", description = "Retrieves complete user information (name, email, phone, role)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User details retrieved"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Permission denied to view this user")
    })
    public ResponseEntity<UserResponseDto> getUser(@PathVariable UUID id) {
        UUID requesterId = getAuthenticatedUserId();
        var user = accessManagementService.getUserById(requesterId, id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/role")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update user role", description = "Changes user role (ADMIN or ASSOCIATE, not SUPER_ADMIN)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid role or attempt to set SUPER_ADMIN"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Permission denied")
    })
    public ResponseEntity<UserResponseDto> updateUserRole(@PathVariable UUID id, @RequestBody @Valid UpdateUserRoleDto data) {
        UUID requesterId = getAuthenticatedUserId();
        var updatedUser = accessManagementService.updateUserRole(requesterId, id, data.newRole());
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/active")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle user active status", description = "Activates or deactivates a user account (true/false)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Active status updated"),
        @ApiResponse(responseCode = "400", description = "Invalid active value (must be true or false)"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Permission denied")
    })
    public ResponseEntity<UserResponseDto> toggleUserActive(@PathVariable UUID id, @RequestBody @Valid ToggleActiveDto data) {
        UUID requesterId = getAuthenticatedUserId();
        var updatedUser = accessManagementService.toggleUserActive(requesterId, id, data.active());
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Edit user profile", description = "Updates user name, email, and phone")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid data or email already in use"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserResponseDto> updateProfile(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateProfileDto data) {
        var updatedUser = accessManagementService.updateProfile(id, data);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete user", description = "Permanently removes a user account (cannot delete self)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "User deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Cannot delete own account"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Permission denied")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        UUID requesterId = getAuthenticatedUserId();
        accessManagementService.deleteUser(requesterId, id);
        return ResponseEntity.noContent().build();
    }

    private UUID getAuthenticatedUserId() {
        User authenticatedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return authenticatedUser.getId();
    }
}

