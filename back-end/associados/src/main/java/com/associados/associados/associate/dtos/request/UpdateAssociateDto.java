package com.associados.associados.associate.dtos.request;

import java.time.LocalDate;

import com.associados.associados.associate.enums.CategoriaEnum;
import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAssociateDto(
        // Associate fields
        @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits")
        String cpf,

        LocalDate birthDate,

        @Pattern(regexp = "\\d{10,11}", message = "Phone must contain 10-11 digits")
        String phone,

        CategoriaEnum workCategory,

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

        String neighborhood,

        String city,

        @Size(min = 2, max = 2, message = "State code must be 2 letters")
        String state,

        // SelfDeclaration fields
        String race,

        String gender,

        String sexualOrientation,

        EscolaridadeEnum education,

        RendaEnum income,

        String disability
) {}
