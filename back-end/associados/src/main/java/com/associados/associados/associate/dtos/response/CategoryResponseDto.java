package com.associados.associados.associate.dtos.response;

import java.util.UUID;

import com.associados.associados.associate.entity.Category;

public record CategoryResponseDto(UUID id, String name) {
    public CategoryResponseDto(Category category) {
        this(category.getId(), category.getName());
    }
}
