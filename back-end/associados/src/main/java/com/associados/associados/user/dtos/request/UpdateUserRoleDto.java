package com.associados.associados.user.dtos.request;

import com.associados.associados.user.enums.RoleEnum;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleDto(
        @NotNull(message = "Role is required")
        RoleEnum newRole
) {}
