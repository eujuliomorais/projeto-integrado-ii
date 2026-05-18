package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatchUserNameDto(
    @NotBlank(message = "The name cannot be blank.")
    @Size(max = 50, message = "The name must have a maximum of 50 characters.")
    String name
) {
    
}
