package com.associados.associados.auth.dtos.request;

import java.time.LocalDate;

import com.associados.associados.associate.enums.CategoriaEnum;
import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterAssociateDto(
        
        @NotBlank(message = "Full name is required")
        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]+$", message = "Name must contain only letters")
        String nomeCompleto,

        @Pattern(regexp = "^[A-Za-zÀ-ÿ ]*$", message = "Social name must contain only letters")
        String nomeSocial,

        String nomeArtistico,

        @NotBlank(message = "CPF is required")
        @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 numeric digits")
        String cpf,

        @NotNull(message = "Birth date is required")
        LocalDate dataNascimento,

        @NotNull(message = "Work category is required")
        CategoriaEnum categoriaAtuacao,

        String disponibilidadeHorario,

        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "\\d{10,11}", message = "Phone must contain between 10 and 11 digits (including area code)")
        String telefone,

        
        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "\\d{8}", message = "Postal code must contain exactly 8 numeric digits")
        String cep,

        @NotBlank(message = "Street/address is required")
        String rua,

        @NotBlank(message = "Number is required")
        String numero,

        @NotBlank(message = "Neighborhood is required")
        String bairro,

        @NotBlank(message = "City is required")
        String cidade,

        @NotBlank(message = "State is required")
        @Size(min = 2, max = 2, message = "State must be the 2-letter UF code")
        String estado,

        
        String raca,
        String genero,
        String orientacaoSexual,
        EscolaridadeEnum escolaridade,
        RendaEnum renda,
        String deficiencia,
        String outrasInfos
) {}
