package com.associados.associados.associate.dtos.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.associate.enums.DisponibilidadeHorarioEnum;
import com.associados.associados.associate.enums.EscolaridadeEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateAssociateDto(
        // Associate fields
        @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits")
        String cpf,

        LocalDate birthDate,

        @Pattern(regexp = "\\d{10,11}", message = "Phone must contain 10-11 digits")
        String phone,

        UUID workCategoryId,

        DisponibilidadeHorarioEnum availableHours,

        @Size(max = 150, message = "Legal guardian name must be at most 150 characters")
        String legalGuardianName,

        // User fields
        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]+$", message = "Full name must contain only letters")
        String fullName,

        @Email(message = "Invalid email format")
        String email,

        // Address fields
        @Pattern(regexp = "\\d{8}", message = "Postal code must contain exactly 8 digits")
        String postalCode,

        String street,

        String number,

        @Size(max = 100, message = "Complement must be at most 100 characters")
        String complement,

        String neighborhood,

        String city,

        @Size(min = 2, max = 2, message = "State code must be 2 letters")
        String state,

        String socialName,

        String race,

        String gender,

        String sexualOrientation,

        EscolaridadeEnum education,

        @PositiveOrZero(message = "Income must be zero or positive")
        BigDecimal income
) {}
