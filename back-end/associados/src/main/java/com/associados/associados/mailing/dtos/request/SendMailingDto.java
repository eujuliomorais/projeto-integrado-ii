package com.associados.associados.mailing.dtos.request;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SendMailingDto(
        @NotBlank String subject,
        @NotBlank String message,
        @NotEmpty List<@NotBlank @Email String> emails
) {
}
