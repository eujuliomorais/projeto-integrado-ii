package com.associados.associados.associate.dtos.response;

import java.math.BigDecimal;

import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.enums.EscolaridadeEnum;

public record SelfDeclarationResponseDto(
        String socialName,
        String race,
        String gender,
        String sexualOrientation,
        EscolaridadeEnum education,
        BigDecimal income,
        boolean acceptedDataSharingTerm
) {
    public SelfDeclarationResponseDto(SelfDeclaration selfDeclaration) {
        this(
                selfDeclaration.getSocialName(),
                selfDeclaration.getRace(),
                selfDeclaration.getGender(),
                selfDeclaration.getSexualOrientation(),
                selfDeclaration.getEducation(),
                selfDeclaration.getIncome(),
                selfDeclaration.isAcceptedDataSharingTerm()
        );
    }
}
