package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatchUserUsernameDto(
        @NotBlank(message = "O username não pode estar em branco")
        @Size(min = 4, message = "O username deve ter no mínimo 4 caracteres")
        String username
) {}