package com.associados.associados.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;

public record AccessKeyLoginDto(
        @NotBlank(message = "Access key is required")
        String accessKey
) {}
