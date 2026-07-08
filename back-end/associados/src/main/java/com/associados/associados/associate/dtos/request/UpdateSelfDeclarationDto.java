package com.associados.associados.associate.dtos.request;

import java.math.BigDecimal;

import com.associados.associados.associate.enums.EscolaridadeEnum;

import jakarta.validation.constraints.PositiveOrZero;

public record UpdateSelfDeclarationDto(
        String socialName,
        String race,
        String gender,
        String sexualOrientation,
        EscolaridadeEnum education,
        @PositiveOrZero(message = "Income must be zero or positive")
        BigDecimal income,
        Boolean acceptedDataSharingTerm

) {}
