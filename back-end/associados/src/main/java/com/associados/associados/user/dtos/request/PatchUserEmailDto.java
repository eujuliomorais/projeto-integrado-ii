package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PatchUserEmailDto(
        @NotBlank(message = "O e-mail não pode estar em branco")
        @Email(message = "E-mail inválido")
        String email
) {}
