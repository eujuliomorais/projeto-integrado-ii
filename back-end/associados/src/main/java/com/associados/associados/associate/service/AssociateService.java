package com.associados.associados.associate.service;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssociateService {

    private final AssociateRepository associateRepository;
    private final UserRepository userRepository;

    @Transactional
    public void register(RegisterAssociateDto data) {

        validateCpf(data.cpf());
        validateAge(data.birthDate());
        validateEmailNotAlreadyUsed(data.email());

        User newUser = new User();
        newUser.setName(data.fullName());
        newUser.setEmail(data.email());
        newUser.setCpf(data.cpf());
        newUser.setPhone(data.phone());
        newUser.setRole(RoleEnum.ASSOCIATE);
        newUser.setActive(true);

        newUser.setPassword(null);
        userRepository.save(newUser);

        Address address = new Address();
        address.setPostalCode(data.postalCode());
        address.setStreet(data.street());
        address.setNumber(data.number());
        address.setNeighborhood(data.neighborhood());
        address.setCity(data.city());
        address.setState(data.state());

        SelfDeclaration declaration = new SelfDeclaration();
        declaration.setRace(data.race());
        declaration.setGender(data.gender());
        declaration.setSexualOrientation(data.sexualOrientation());
        declaration.setEducation(data.education());
        declaration.setIncome(data.income());
        declaration.setDisability(data.disability());

        Associate associate = new Associate();
        associate.setCpf(data.cpf());
        associate.setBirthDate(data.birthDate());
        associate.setWorkCategory(data.workCategory());
        associate.setPhone(data.phone());
        associate.setUser(newUser);
        associate.setAddress(address);
        associate.setSelfDeclaration(declaration);

        associateRepository.save(associate);
    }

    private void validateCpf(String cpf) {
        if (cpf == null || cpf.isEmpty()) {
            throw new IllegalArgumentException("CPF is required");
        }
        if (cpf.matches("\\d{11}") && !cpf.matches("(.)\\1{10}")) {
            return;
        }
        throw new IllegalArgumentException("Invalid CPF format");
    }

    private void validateAge(java.time.LocalDate birthDate) {
        if (birthDate == null) {
            throw new IllegalArgumentException("Birth date is required");
        }
        java.time.LocalDate today = java.time.LocalDate.now();
        int age = today.getYear() - birthDate.getYear();
        if (age < 18) {
            throw new IllegalArgumentException("Must be at least 18 years old to register");
        }
    }

    private void validateEmailNotAlreadyUsed(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
    }
}