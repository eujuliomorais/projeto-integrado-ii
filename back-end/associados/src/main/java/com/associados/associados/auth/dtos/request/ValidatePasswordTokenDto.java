package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record ValidatePasswordTokenDto(
    @NotBlank(message = "Token is required")
    String token
) {}
