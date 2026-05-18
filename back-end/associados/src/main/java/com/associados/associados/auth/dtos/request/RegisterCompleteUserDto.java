package com.associados.associados.auth.dtos.request;

import java.time.LocalDate;
import java.util.List;

import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Disability;
import com.associados.associados.user.enums.Education;
import com.associados.associados.user.enums.Race;
import com.associados.associados.user.enums.SexualOrientation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterCompleteUserDto(
    
    @NotNull(message = "Birth date is required")
    LocalDate birthDate,
    
    @NotNull(message = "Work category is required")
    CategoryEnum workCategory,
    
    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "\\d{8}", message = "Postal code must contain exactly 8 digits")
    String postalCode,
    
    @NotBlank(message = "Street is required")
    @Size(max = 255, message = "Street must have a maximum of 255 characters")
    String street,
    
    @NotBlank(message = "Number is required")
    @Size(max = 20, message = "Number must have a maximum of 20 characters")
    String number,
    
    @NotBlank(message = "Neighborhood is required")
    @Size(max = 100, message = "Neighborhood must have a maximum of 100 characters")
    String neighborhood,
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must have a maximum of 100 characters")
    String city,
    
    @NotBlank(message = "State is required")
    @Size(min = 2, max = 2, message = "State code must be exactly 2 letters")
    String state,
    
    @NotNull(message = "Race is required")
    Race race,
    
    @NotNull(message = "Sexual orientation is required")
    SexualOrientation sexualOrientation,
    
    @NotNull(message = "Education level is required")
    Education education,
    
    @NotNull(message = "The disabilities list container cannot be null (send an empty array [] if none)")
    List<Disability> disabilities,

    @NotNull(message = "Legal guardian name is required for users under 18")
    @Size(max = 100, message = "Legal guardian name must have a maximum of 100 characters")
    String LegalGuardianName
) {

}