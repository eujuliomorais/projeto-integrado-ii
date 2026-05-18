package com.associados.associados.auth.dtos.request;


import org.hibernate.validator.constraints.br.CPF;

import com.associados.associados.user.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterManagementUserDto(
    
    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "The name must have a maximum of 50 characters.")
    @Pattern(
        regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s'-]{2,50}$",
        message = "The name should contain only letters, spaces, apostrophes, or hyphens."
    )
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "CPF is required")
    @CPF(message = "Invalid CPF format")
    String cpf,

    @NotBlank(message = "Phone number is required")
    @Size(min = 11, max = 11, message = "Phone number must contain exactly 11 digits")
    String phoneNumber,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password,

    @NotNull(message = "Role is required")
    Role role
) {
}