package com.associados.associados.auth.dtos.request;

import com.associados.associados.user.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterUserDto(
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String name,
        @NotNull RoleEnum role
) {}
