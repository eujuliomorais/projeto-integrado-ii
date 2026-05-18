package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ResetPasswordDto(
    @Email(message = "Invalid email format")
    String email,
    String token,
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String newPassword,
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String confirmPassword
) {

}
