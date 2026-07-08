package com.associados.associados.card.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.card.entity.Card;
import com.associados.associados.associate.dtos.response.CategoryResponseDto;

public record CardResponseDto(
        UUID id,
        UUID associateId,
        String fullName,
        String socialName,
        String cpf,
        LocalDate validity,
        CategoryResponseDto category,
        String number,
        String avatarUrl) {
    public CardResponseDto(Card card) {
        this(
                card.getId(),
                card.getAssociate().getId(),
                card.getFullName(),
                card.getSocialName(),
                card.getCpf(),
                card.getValidity(),
                card.getCategory() == null ? null : new CategoryResponseDto(card.getCategory()),
                card.getNumber(),
                card.getUser() == null ? null : card.getUser().getAvatarUrl());
    }
}
