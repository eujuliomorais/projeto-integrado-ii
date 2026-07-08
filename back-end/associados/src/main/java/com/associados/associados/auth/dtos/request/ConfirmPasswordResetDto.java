package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConfirmPasswordResetDto(
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String newPassword,

    @NotBlank(message = "Password confirmation is required")
    String confirmPassword
) {}
