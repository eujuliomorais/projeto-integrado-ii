package com.associados.associados.associate.entity;

import java.util.UUID;

import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;

import jakarta.persistence.Column;
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

    @Column(length = 50)
    private String race;

    @Column(length = 50)
    private String gender;

    @Column(length = 100)
    private String sexualOrientation;

    @Enumerated(EnumType.STRING)
    private EscolaridadeEnum education;

    @Enumerated(EnumType.STRING)
    private RendaEnum income;

    @Column(length = 255)
    private String disability;
}

