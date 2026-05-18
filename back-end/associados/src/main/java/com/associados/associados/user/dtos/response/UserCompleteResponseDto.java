package com.associados.associados.user.dtos.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Disability;
import com.associados.associados.user.enums.Education;
import com.associados.associados.user.enums.Race;
import com.associados.associados.user.enums.Role;
import com.associados.associados.user.enums.SexualOrientation;

public record UserCompleteResponseDto(
    UUID id,
    String name,
    String email,
    String cpf,
    String phoneNumber,
    Role role,
    LocalDate birthDate,
    CategoryEnum workCategory,
    String postalCode,
    String street,
    String number,
    String neighborhood,
    String city,
    String state,
    Race race,
    SexualOrientation sexualOrientation,
    Education education,
    List<Disability> disabilities
) {
    public static UserCompleteResponseDto fromEntity(User user) {
        if (user == null) return null;
        
        return new UserCompleteResponseDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCpf(),
            user.getPhoneNumber(),
            user.getRole(),
            user.getBirthDate(),
            user.getCategory(),
            user.getPostalCode(),
            user.getStreet(),
            user.getNumber(),
            user.getNeighborhood(),
            user.getCity(),
            user.getState(),
            user.getRace(),
            user.getSexualOrientation(),
            user.getEducation(),
            user.getDisabilities() != null ? List.copyOf(user.getDisabilities()) : List.of()
        );
    }
}