package com.associados.associados.associate.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter @Setter @NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "\\d{8}", message = "Postal code must contain exactly 8 digits")
    @Column(length = 8)
    private String postalCode;

    @NotBlank(message = "Street is required")
    @Column(length = 255)
    private String street;

    @NotBlank(message = "Number is required")
    @Column(length = 20)
    private String number;

    @NotBlank(message = "Neighborhood is required")
    @Column(length = 100)
    private String neighborhood;

    @NotBlank(message = "City is required")
    @Column(length = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(min = 2, max = 2, message = "State code must be 2 letters")
    @Column(length = 2)
    private String state;
}

