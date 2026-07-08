package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateProfileDto(
        @NotBlank(message = "Full name is required")
        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]+$", message = "Full name must contain only letters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "\\d{10,11}", message = "Phone must contain between 10 and 11 digits")
        String phone
) {}
