package com.associados.associados.associate.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.associados.associados.associate.enums.CategoriaEnum;
import com.associados.associados.user.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "associates")
@Getter @Setter @NoArgsConstructor
public class Associate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String cpf;
    private LocalDate dataNascimento;
    
    @Enumerated(EnumType.STRING)
    private CategoriaEnum categoriaAtuacao;
    
    private String telefone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "declaration_id")
    private SelfDeclaration selfDeclaration;
}
