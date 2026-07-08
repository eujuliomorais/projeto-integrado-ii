package com.associados.associados.card.dtos.response;

import java.time.LocalDate;

import com.associados.associados.associate.dtos.response.CategoryResponseDto;

public record CardValidationResponseDto(
        boolean valid,
        String avatarUrl,
        String fullName,
        String socialName,
        CategoryResponseDto category,
        String number,
        LocalDate validity,
        String message) {
}
