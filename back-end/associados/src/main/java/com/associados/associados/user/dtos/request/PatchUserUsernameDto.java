package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatchUserUsernameDto(
        @NotBlank(message = "The username cannot be blank")
        @Size(min = 4, message = "The username must have at least 4 characters")
        String username
) {}