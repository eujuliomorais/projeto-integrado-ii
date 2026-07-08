package com.associados.associados.associate.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.enums.DisponibilidadeHorarioEnum;
import com.associados.associados.user.dtos.response.UserResponseDto;

public record AssociateResponseDto(
        UUID id,
        String cpf,
        LocalDate birthDate,
        String phone,
        CategoryResponseDto workCategory,
        DisponibilidadeHorarioEnum availableHours,
        String legalGuardianName,
        UserResponseDto user,
        Address address,
        SelfDeclaration selfDeclaration,
        String cardNumber
) {
    public AssociateResponseDto(Associate associate, String cardNumber) {
        this(
                associate.getId(),
                associate.getCpf(),
                associate.getBirthDate(),
                associate.getPhone(),
                associate.getWorkCategory() == null ? null : new CategoryResponseDto(associate.getWorkCategory()),
                associate.getAvailableHours(),
                associate.getLegalGuardianName(),
                new UserResponseDto(associate.getUser()),
                associate.getAddress(),
                associate.getSelfDeclaration(),
                cardNumber
        );
    }
}
