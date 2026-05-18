package com.associados.associados.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.validator.constraints.br.CPF;

import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Disability;
import com.associados.associados.user.enums.Education;
import com.associados.associados.user.enums.Race;
import com.associados.associados.user.enums.Role;
import com.associados.associados.user.enums.SexualOrientation;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    
    @Id @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @Size(max = 50, message = "The name must have a maximum of 50 characters.")
    @Pattern(
        regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s'-]{2,50}$",
        message = "The name should contain only letters, spaces, apostrophes, or hyphens."
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @Size(min = 8, message = "The password must have a minimum of 8 characters.")
    private String password;

    @CPF(message = "Invalid CPF format")
    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false, length = 11)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDate birthDate;

    @NotNull(message = "Work category is required")
    @Enumerated(EnumType.STRING)
    private CategoryEnum category;

    @Column(length = 8)
    private String postalCode;

    @NotNull(message = "Street is required")
    @Column(length = 255)
    private String street;

    @Column(length = 20)
    private String number;

    @Column(length = 100)
    private String neighborhood;

    @Column(length = 100)
    private String city;

    @Column(length = 2)
    private String state;

    @Enumerated(EnumType.STRING)
    private Race race;

    @Enumerated(EnumType.STRING)
    private SexualOrientation sexualOrientation;

    @Enumerated(EnumType.STRING)
    private Education education;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_disabilities", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)    
    private List<Disability> disabilities = new ArrayList<>();

    @NotNull(message = "Legal guardian name is required for users under 18")
    @Column(length = 100)
    private String legalGuardianName = "";

    @Column(nullable=false)
    @JsonIgnore
    private boolean isEnabled = false;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_code_expiry")
    private LocalDateTime verificationCodeExpiry;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expiry")
    private LocalDateTime passwordResetTokenExpiry;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
