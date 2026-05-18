package com.associados.associados.user.dtos.response;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.Role;
import java.util.UUID;

public record UserManagementResponseDto(
    UUID id,
    String name,
    String email,
    String cpf,
    String phoneNumber,
    Role role
) {

    public static UserManagementResponseDto fromEntity(User user) {
        if (user == null) return null;
        
        return new UserManagementResponseDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCpf(),
            user.getPhoneNumber(),
            user.getRole()
        );
    }
}
