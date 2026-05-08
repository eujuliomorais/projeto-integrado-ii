package com.associados.associados.user.dtos.request;

import jakarta.validation.constraints.NotNull;

public record ToggleActiveDto(
        @NotNull(message = "Active status is required")
        Boolean active
) {}
