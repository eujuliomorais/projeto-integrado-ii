package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordDto(
    @NotBlank String token,
    @NotBlank @Size(min = 8, message = "The password must have at least 8 characters")
    String newPassword
) {}