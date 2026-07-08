package com.associados.associados.associate.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryDto(
        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Category name must be at most 100 characters")
        String name
) {}
