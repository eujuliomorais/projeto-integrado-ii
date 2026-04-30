package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatchUserNameDto(
        @NotBlank(message = "The name cannot be blank")
        @Size(min = 3, max = 100, message = "The name must have between 3 and 100 characters")
        String name
) {}