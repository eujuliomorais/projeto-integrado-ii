package com.associados.associados.associate.entity;

import java.util.UUID;

import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "self_declarations")
@Getter @Setter @NoArgsConstructor
public class SelfDeclaration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String raca;
    private String genero;
    private String orientacaoSexual;
    
    @Enumerated(EnumType.STRING)
    private EscolaridadeEnum escolaridade;
    
    @Enumerated(EnumType.STRING)
    private RendaEnum renda;
    
    private String deficiencia;
}
