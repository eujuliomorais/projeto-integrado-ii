package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.Email;

public record PatchUserEmailDto(
    @Email(message = "Invalid email format")
    String email
) {
    
}
