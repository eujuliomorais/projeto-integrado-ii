package com.associados.associados.user.dtos.response;

public record ErrorResponseDto(
        String message,
        int status,
        String timestamp
) {}
