package com.associados.associados.auth.dtos.request;

import com.associados.associados.user.enums.RoleEnum;
import jakarta.validation.constraints.*;

public record RegisterUserDto(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]+$", message = "Name must contain only letters")
        String name,

        @NotNull(message = "Role is required")
        RoleEnum role
) {}
