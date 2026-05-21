package com.associados.associados.associate.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.associados.associados.associate.dtos.request.UpdateAssociateDto;
import com.associados.associados.associate.dtos.response.AssociateResponseDto;
import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
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
        if(data.birthDate().isAfter(java.time.LocalDate.now().minusYears(18))) {
            associate.setLegalGuardianName(data.legalGuardianName());
        }
        else {
            associate.setLegalGuardianName("");
        }
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

    private void validateEmailNotAlreadyUsed(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
    }

    public Page<AssociateResponseDto> getAllAssociates(Pageable pageable) {
        return associateRepository.findAll(pageable).map(AssociateResponseDto::new);
    }

    public AssociateResponseDto getAssociateById(java.util.UUID id) {
        Associate associate = findAssociateOrThrow(id);
        return new AssociateResponseDto(associate);
    }

    @Transactional
    public AssociateResponseDto updateAssociate(java.util.UUID id, UpdateAssociateDto data) {
        Associate associate = findAssociateOrThrow(id);
        User user = associate.getUser();
        Address address = associate.getAddress();
        SelfDeclaration declaration = associate.getSelfDeclaration();

        // Update Associate fields
        if (data.cpf() != null) {
            validateCpf(data.cpf());
            validateCpfNotAlreadyUsed(data.cpf(), id);
            associate.setCpf(data.cpf());
        }

        if (data.birthDate() != null) {
            associate.setBirthDate(data.birthDate());
        }

        if (data.phone() != null) {
            associate.setPhone(data.phone());
        }

        if (data.workCategory() != null) {
            associate.setWorkCategory(data.workCategory());
        }

        // Update User fields
        if (data.fullName() != null) {
            user.setName(data.fullName());
        }

        if (data.email() != null) {
            user.setEmail(data.email());
        }

        // Update Address fields
        if (data.postalCode() != null) {
            address.setPostalCode(data.postalCode());
        }

        if (data.street() != null) {
            address.setStreet(data.street());
        }

        if (data.number() != null) {
            address.setNumber(data.number());
        }

        if (data.neighborhood() != null) {
            address.setNeighborhood(data.neighborhood());
        }

        if (data.city() != null) {
            address.setCity(data.city());
        }

        if (data.state() != null) {
            address.setState(data.state());
        }

        // Update SelfDeclaration fields
        if (data.race() != null) {
            declaration.setRace(data.race());
        }

        if (data.gender() != null) {
            declaration.setGender(data.gender());
        }

        if (data.sexualOrientation() != null) {
            declaration.setSexualOrientation(data.sexualOrientation());
        }

        if (data.education() != null) {
            declaration.setEducation(data.education());
        }

        if (data.income() != null) {
            declaration.setIncome(data.income());
        }

        if (data.disability() != null) {
            declaration.setDisability(data.disability());
        }

        return new AssociateResponseDto(associateRepository.save(associate));
    }

    @Transactional
    public void deleteAssociate(java.util.UUID id) {
        if (!associateRepository.existsById(id)) {
            throw new BusinessException("Associate not found");
        }
        associateRepository.deleteById(id);
    }

    private Associate findAssociateOrThrow(java.util.UUID id) {
        return associateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Associate not found"));
    }

    private void validateCpfNotAlreadyUsed(String cpf, java.util.UUID associateId) {
        associateRepository.findByCpf(cpf).ifPresent(existing -> {
            if (!existing.getId().equals(associateId)) {
                throw new IllegalArgumentException("CPF already registered");
            }
        });
    }
}
