package com.associados.associados.auth.dtos.response;

public record TokenValidationResponseDto(String message, Boolean valid, String resetToken) {}
