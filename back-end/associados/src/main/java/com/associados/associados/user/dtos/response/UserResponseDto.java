package com.associados.associados.user.dtos.response;

import java.util.UUID;

import com.associados.associados.user.entity.User;

public record UserResponseDto(UUID id, String name, String email, String cpf, String phone, String role, boolean active, String avatarUrl) {
    public UserResponseDto(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCpf(),
                user.getPhone(),
                user.getRole().name(),
                user.isActive(),
                user.getAvatarUrl()
        );
    }
}
