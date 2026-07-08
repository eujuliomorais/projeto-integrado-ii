package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginAssociateDto(
       @NotBlank(message = "Email is required")
       @Email(message = "Invalid email format")
       String email
) {}
