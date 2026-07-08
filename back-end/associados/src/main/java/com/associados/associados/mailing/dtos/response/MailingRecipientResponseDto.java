package com.associados.associados.mailing.dtos.response;

import java.util.UUID;

import com.associados.associados.user.entity.User;

public record MailingRecipientResponseDto(UUID id, String name, String email) {
    public MailingRecipientResponseDto(User user) {
        this(user.getId(), user.getName(), user.getEmail());
    }
}
