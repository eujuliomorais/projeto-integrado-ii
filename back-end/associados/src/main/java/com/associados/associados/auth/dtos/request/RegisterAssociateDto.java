package com.associados.associados.auth.dtos.request;

import java.time.LocalDate;

import com.associados.associados.associate.enums.CategoriaEnum;
import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterAssociateDto(
        @Valid
        BaseRegisterDto baseData,

        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]*$", message = "Social name must contain only letters")
        String socialName,

        String artisticName,

        @NotNull(message = "Birth date is required")
        LocalDate birthDate,

        @NotNull(message = "Work category is required")
        CategoriaEnum workCategory,

        String availableHours,

        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "\\d{8}", message = "Postal code must contain exactly 8 numeric digits")
        String postalCode,

        @NotBlank(message = "Street/address is required")
        String street,

        @NotBlank(message = "Number is required")
        String number,

        @NotBlank(message = "Neighborhood is required")
        String neighborhood,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        @Size(min = 2, max = 2, message = "State must be the 2-letter code")
        String state,

        String race,
        String gender,
        String sexualOrientation,
        EscolaridadeEnum education,
        RendaEnum income,
        String disability,
        String additionalInfo
) {
        public String email() {
                return baseData.email();
        }

        public String password() {
                return baseData.password();
        }

        public String fullName() {
                return baseData.fullName();
        }

        public String cpf() {
                return baseData.cpf();
        }

        public String phone() {
                return baseData.phone();
        }
}
