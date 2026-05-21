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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "CPF is required")
    @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits")
    private String cpf;

    @NotNull(message = "Birth date is required")
    private LocalDate birthDate;

    @NotNull(message = "Work category is required")
    @Enumerated(EnumType.STRING)
    private CategoriaEnum workCategory;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "\\d{10,11}", message = "Phone must contain 10-11 digits")
    private String phone;

    @NotNull(message = "Associated user is required")
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Address is required")
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "declaration_id")
    private SelfDeclaration selfDeclaration;

    @Size(max = 255, message = "Legal guardian name must be at most 255 characters")
    private String legalGuardianName;

    public void validateSecurityConstraints() {
        if (user == null || !user.getRole().name().equals("ASSOCIATE")) {
            throw new IllegalStateException("Associate must have ASSOCIATE role");
        }
    }
}

