package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.Email;

public record LoginDto(
    @Email(message = "Invalid email format")
    String email,
    String password
) {
    
}
