package com.associados.associados.card.service;

import java.time.LocalDate;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.service.EmailService;
import com.associados.associados.card.dtos.response.CardResponseDto;
import com.associados.associados.card.dtos.response.CardValidationResponseDto;
import com.associados.associados.card.entity.Card;
import com.associados.associados.card.repository.CardRepository;
import com.associados.associados.config.SystemConfigurationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AssociateRepository associateRepository;
    private final CardPdfService cardPdfService;
    private final EmailService emailService;
    private final SystemConfigurationService configurationService;

    @Transactional
    public Card createForAssociate(Associate associate) {
        if (associate == null || associate.getId() == null) {
            throw new BusinessException("Associate is required to generate a card");
        }

        if (cardRepository.existsByAssociateId(associate.getId())) {
            return cardRepository.findByAssociateId(associate.getId())
                    .orElseThrow(() -> new BusinessException("Card already exists for this associate"));
        }

        LocalDate configuredValidity = configurationService.getCardValidityConfiguration()
                .orElseThrow(() -> new BusinessException("Card generation is currently unavailable. A default validity date has not been set by an administrator."));

        Card card = new Card();
        card.setAssociate(associate);
        card.setUser(associate.getUser());
        card.setFullName(associate.getUser().getName());
        card.setSocialName(resolveSocialName(associate));
        card.setCpf(associate.getCpf());
        card.setCategory(associate.getWorkCategory());
        
        card.setValidity(configuredValidity); 
        card.setNumber(generateCardNumber());

        return cardRepository.save(card);
    }

    public CardResponseDto getOwnCard(java.util.UUID userId) {
        Associate associate = associateRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Associate not found"));

        Card card = cardRepository.findByAssociateId(associate.getId())
                .orElseThrow(() -> new BusinessException("Card not found"));

        return new CardResponseDto(card);
    }

    @Transactional
    public void syncCard(Associate associate) {
        cardRepository.findByAssociateId(associate.getId()).ifPresent(card -> {
            card.setFullName(associate.getUser().getName());
            card.setSocialName(resolveSocialName(associate));
            card.setCategory(associate.getWorkCategory());
            cardRepository.save(card);
        });
    }

    public byte[] downloadOwnCard(java.util.UUID userId) {
        Associate associate = associateRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Associate not found"));
        Card card = cardRepository.findByAssociateId(associate.getId())
                .orElseThrow(() -> new BusinessException("Card not found"));
        requirePhoto(card);
        return cardPdfService.generate(card);
    }

    public byte[] downloadAssociateCard(java.util.UUID associateId) {
        Card card = cardRepository.findByAssociateId(associateId)
                .orElseThrow(() -> new BusinessException("Card not found for this associate"));
        requirePhoto(card);
        return cardPdfService.generate(card);
    }

    public void sendCardByEmail(java.util.UUID associateId) {
        Card card = cardRepository.findByAssociateId(associateId)
                .orElseThrow(() -> new BusinessException("Card not found for this associate"));
        requirePhoto(card);
        byte[] pdf = cardPdfService.generate(card);
        String filename = "carteirinha-" + card.getNumber() + ".pdf";
        String greetingName = card.getSocialName() != null && !card.getSocialName().isBlank()
                ? card.getSocialName()
                : card.getFullName();
        emailService.sendEmailWithAttachment(
                card.getUser().getEmail(),
                "Sua Carteirinha - Associados",
                "Olá " + greetingName + ",\n\nSegue em anexo sua carteirinha de associado.",
                pdf,
                filename);
    }

    @Transactional
    public void deleteByAssociateId(java.util.UUID associateId) {
        if (associateId == null) {
            return;
        }
        cardRepository.deleteByAssociateId(associateId);
    }

    public CardValidationResponseDto validateCard(String number) {
        Card card = cardRepository.findByNumber(number).orElse(null);

        if (card == null) {
            return new CardValidationResponseDto(
                    false,
                    null,
                    null,
                    null,
                    null,
                    number,
                    null,
                    "Card not found");
        }

        boolean valid = !card.getValidity().isBefore(LocalDate.now());
        String message = valid ? "Card is valid" : "Card expired";
        return new CardValidationResponseDto(
                valid,
                card.getUser() == null ? null : card.getUser().getAvatarUrl(),
                card.getFullName(),
                card.getSocialName(),
                card.getCategory() == null ? null : new com.associados.associados.associate.dtos.response.CategoryResponseDto(card.getCategory()),
                card.getNumber(),
                card.getValidity(),
                message);
    }

    private String generateCardNumber() {
        String yearPrefix = String.format(Locale.ROOT, "%02d", LocalDate.now().getYear() % 100);
        long sequence = cardRepository.countByNumberStartingWith(yearPrefix) + 1;
        if (sequence > 999) {
            throw new BusinessException("Card number limit reached for the current year");
        }
        return yearPrefix + String.format(Locale.ROOT, "%03d", sequence);
    }

    private String resolveSocialName(Associate associate) {
        SelfDeclaration declaration = associate.getSelfDeclaration();
        if (declaration != null && declaration.getSocialName() != null && !declaration.getSocialName().isBlank()) {
            return declaration.getSocialName();
        }
        return "";
    }

    private void requirePhoto(Card card) {
        String avatarUrl = card.getUser() == null ? null : card.getUser().getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            throw new BusinessException("A carteirinha não pode ser baixada ou enviada porque o associado não possui foto de perfil.");
        }
    }

    public Card updateCardValidity(java.util.UUID associateId, LocalDate newValidity) {
        if (newValidity != null && newValidity.isBefore(LocalDate.now())) {
            throw new BusinessException("The new validity date cannot be in the past");
        }

        Card card = cardRepository.findByAssociateId(associateId)
                .orElseThrow(() -> new BusinessException("Card not found for the given associate ID"));

        card.setValidity(newValidity);
        return cardRepository.save(card);
    }

    @Transactional
    public CardResponseDto renewCard(java.util.UUID associateId) {
        Card card = cardRepository.findByAssociateId(associateId)
                .orElseThrow(() -> new BusinessException("Card not found for this associate"));

        LocalDate configuredValidity = configurationService.getCardValidityConfiguration()
                .orElseThrow(() -> new BusinessException("Card renewal is currently unavailable. A default validity date has not been set by an administrator."));

        if (configuredValidity.isBefore(LocalDate.now())) {
            throw new BusinessException("Card renewal is currently unavailable. The configured validity date is in the past and must be updated by an administrator.");
        }

        card.setValidity(configuredValidity);
        return new CardResponseDto(cardRepository.save(card));
    }
}