package com.associados.associados.associate.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EscolaridadeEnum {

    NÃO_SELECIONADO("Não selecionado"),

    FUNDAMENTAL_INCOMPLETO("Ensino Fundamental Incompleto"),
    FUNDAMENTAL_COMPLETO("Ensino Fundamental Completo"),

    MEDIO_INCOMPLETO("Ensino Médio Incompleto"),
    MEDIO_COMPLETO("Ensino Médio Completo"),

    SUPERIOR_INCOMPLETO("Ensino Superior Incompleto"),
    SUPERIOR_COMPLETO("Ensino Superior Completo"),

    ESPECIALIZACAO_INCOMPLETA("Especialização Incompleta"),
    ESPECIALIZACAO_COMPLETA("Especialização Completa"),

    MESTRADO_INCOMPLETO("Mestrado Incompleto"),
    MESTRADO_COMPLETO("Mestrado Completo"),

    DOUTORADO_INCOMPLETO("Doutorado Incompleto"),
    DOUTORADO_COMPLETO("Doutorado Completo");

    @JsonCreator
    public static EscolaridadeEnum fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return NÃO_SELECIONADO;
        }
        
        try {
            return EscolaridadeEnum.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return NÃO_SELECIONADO; 
        }
    }

    private final String description;
}