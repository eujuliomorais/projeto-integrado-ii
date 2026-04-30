package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PatchUserEmailDto(
        @NotBlank(message = "The email cannot be blank")
        @Email(message = "Invalid email")
        String email
) {}
