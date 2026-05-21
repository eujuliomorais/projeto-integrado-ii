package com.associados.associados.associate.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.enums.CategoriaEnum;
import com.associados.associados.user.dtos.response.UserResponseDto;

public record AssociateResponseDto(
        UUID id,
        String cpf,
        LocalDate birthDate,
        String phone,
        CategoriaEnum workCategory,
        UserResponseDto user,
        Address address,
        SelfDeclaration selfDeclaration
) {
    public AssociateResponseDto(Associate associate) {
        this(
                associate.getId(),
                associate.getCpf(),
                associate.getBirthDate(),
                associate.getPhone(),
                associate.getWorkCategory(),
                new UserResponseDto(associate.getUser()),
                associate.getAddress(),
                associate.getSelfDeclaration()
        );
    }
}
