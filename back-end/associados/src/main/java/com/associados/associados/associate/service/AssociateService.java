package com.associados.associados.associate.service;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.associados.associados.associate.dtos.request.UpdateAssociateDto;
import com.associados.associados.associate.dtos.request.UpdateSelfDeclarationDto;
import com.associados.associados.associate.dtos.response.AssociateResponseDto;
import com.associados.associados.associate.dtos.response.SelfDeclarationResponseDto;
import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.Category;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.associate.repository.CategoryRepository;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.repository.AuthTokenRepository;
import com.associados.associados.card.entity.Card;
import com.associados.associados.card.repository.CardRepository;
import com.associados.associados.card.service.CardService;
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
    private final CategoryRepository categoryRepository;
    private final CardService cardService;
    private final AuthTokenRepository authTokenRepository;
    private final CardRepository cardRepository;

    @Transactional
    public void register(RegisterAssociateDto data) {

        validateCpf(data.cpf());
        validateEmailNotAlreadyUsed(data.email());
        Category workCategory = findCategoryOrThrow(data.workCategoryId());

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
        address.setComplement(data.complement());
        address.setNeighborhood(data.neighborhood());
        address.setCity(data.city());
        address.setState(data.state());

        SelfDeclaration declaration = new SelfDeclaration();
        declaration.setSocialName(data.socialName());
        declaration.setRace(data.race());
        declaration.setGender(data.gender());
        declaration.setSexualOrientation(data.sexualOrientation());
        declaration.setEducation(data.education());
        declaration.setIncome(data.income());
        declaration.setAcceptedDataSharingTerm(data.acceptedDataSharingTerm());

        Associate associate = new Associate();
        associate.setCpf(data.cpf());
        associate.setBirthDate(data.birthDate());
        if (data.birthDate().isAfter(LocalDate.now().minusYears(18))) {
            associate.setLegalGuardianName(data.legalGuardianName());
        } else {
            associate.setLegalGuardianName("");
        }
        associate.setWorkCategory(workCategory);
        associate.setAvailableHours(data.availableHours());
        associate.setPhone(data.phone());
        associate.setUser(newUser);
        associate.setAddress(address);
        associate.setSelfDeclaration(declaration);

        Associate savedAssociate = associateRepository.save(associate);
        cardService.createForAssociate(savedAssociate);
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
        return associateRepository.findAll(pageable).map(associate -> {
            String cardNumber = cardRepository.findByAssociateId(associate.getId()).map(Card::getNumber).orElse(null);
            return new AssociateResponseDto(associate, cardNumber);
        });
    }

    public AssociateResponseDto getAssociateById(java.util.UUID id) {
        Associate associate = findAssociateOrThrow(id);
        String cardNumber = cardRepository.findByAssociateId(associate.getId()).map(Card::getNumber).orElse(null);
        return new AssociateResponseDto(associate, cardNumber);
    }

    public AssociateResponseDto getAssociateByUserId(java.util.UUID userId) {
        Associate associate = associateRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Associate not found"));
        String cardNumber = cardRepository.findByAssociateId(associate.getId()).map(Card::getNumber).orElse(null);
        return new AssociateResponseDto(associate, cardNumber);
    }

    @Transactional
    public AssociateResponseDto updateAssociate(UUID id, UpdateAssociateDto data) {
        Associate associate = findAssociateOrThrow(id);
        User user = associate.getUser();
        Address address = associate.getAddress();
        SelfDeclaration declaration = associate.getSelfDeclaration();

        // Associate
        if (data.cpf() != null) {
            validateCpf(data.cpf());
            validateCpfNotAlreadyUsed(data.cpf(), id);
            associate.setCpf(data.cpf());
        }

        if (data.birthDate() != null) {
            associate.setBirthDate(data.birthDate());
        }

        if (associate.getBirthDate().isAfter(LocalDate.now().minusYears(18))) {
            if (data.legalGuardianName() != null) {
                associate.setLegalGuardianName(data.legalGuardianName());
            }
        } else {
            associate.setLegalGuardianName("");
        }

        if (data.phone() != null) {
            associate.setPhone(data.phone());
        }

        if (data.workCategoryId() != null) {
            associate.setWorkCategory(findCategoryOrThrow(data.workCategoryId()));
        }

        if (data.availableHours() != null) {
            associate.setAvailableHours(data.availableHours());
        }

        // User
        if (data.fullName() != null) {
            user.setName(data.fullName());
        }

        if (data.email() != null) {
            user.setEmail(data.email());
        }

        if (data.postalCode() != null) {
            address.setPostalCode(data.postalCode());
        }

        if (data.street() != null) {
            address.setStreet(data.street());
        }

        if (data.number() != null) {
            address.setNumber(data.number());
        }

        if (data.complement() != null) {
            address.setComplement(data.complement());
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

        if (declaration != null) {
            if (data.socialName() != null) {
                declaration.setSocialName(data.socialName());
            }

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
        }

        Associate savedAssociate = associateRepository.save(associate);

        cardService.syncCard(savedAssociate);

        String cardNumber = cardRepository.findByAssociateId(savedAssociate.getId())
                .map(Card::getNumber)
                .orElse(null);

        return new AssociateResponseDto(savedAssociate, cardNumber);
    }

    @Transactional
    public SelfDeclarationResponseDto updateSelfDeclaration(java.util.UUID userId, UpdateSelfDeclarationDto data) {
        Associate associate = associateRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Associate not found"));

        SelfDeclaration declaration = associate.getSelfDeclaration();
        if (declaration == null) {
            declaration = new SelfDeclaration();
            associate.setSelfDeclaration(declaration);
        }

        declaration.setSocialName(data.socialName());
        declaration.setRace(data.race());
        declaration.setGender(data.gender());
        declaration.setSexualOrientation(data.sexualOrientation());
        
        declaration.setEducation(data.education());

        declaration.setIncome(data.income());

        if (data.acceptedDataSharingTerm() != null) {
            declaration.setAcceptedDataSharingTerm(data.acceptedDataSharingTerm());
        }

        Associate savedAssociate = associateRepository.save(associate);
        cardService.syncCard(savedAssociate);
        return new SelfDeclarationResponseDto(savedAssociate.getSelfDeclaration());
    }

    @Transactional
    public void deleteAssociate(java.util.UUID id) {
        Associate associate = findAssociateOrThrow(id);

        cardService.deleteByAssociateId(associate.getId());
        authTokenRepository.deleteByUser(associate.getUser());

        associateRepository.deleteById(id);
    }

    private Associate findAssociateOrThrow(java.util.UUID id) {
        return associateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Associate not found"));
    }

    private Category findCategoryOrThrow(java.util.UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Category not found"));
    }

    private void validateCpfNotAlreadyUsed(String cpf, java.util.UUID associateId) {
        associateRepository.findByCpf(cpf).ifPresent(existing -> {
            if (!existing.getId().equals(associateId)) {
                throw new IllegalArgumentException("CPF already registered");
            }
        });
    }
}
