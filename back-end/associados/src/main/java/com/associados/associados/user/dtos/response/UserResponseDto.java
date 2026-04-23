package com.associados.associados.user.dtos.response;

import com.associados.associados.user.entity.User;

import java.util.UUID;

public record UserResponseDto(UUID id, String name, String email, String role) {

    public UserResponseDto(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
