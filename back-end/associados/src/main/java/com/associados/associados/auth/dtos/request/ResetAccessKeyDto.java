package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetAccessKeyDto(
        @NotBlank(message = "New access key is required")
        @Size(min = 8, message = "New access key must be at least 8 characters")
        String newAccessKey,

        @NotBlank(message = "Access key confirmation is required")
        String confirmAccessKey
) {}
