package com.associados.associados.mailing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.associados.associados.auth.service.EmailService;
import com.associados.associados.mailing.dtos.request.SendMailingDto;
import com.associados.associados.mailing.dtos.response.MailingRecipientResponseDto;
import com.associados.associados.mailing.enums.MailingRecipientScope;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailingService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<MailingRecipientResponseDto> getRecipients(MailingRecipientScope scope) {
        List<User> recipients = switch (scope) {
            case ALL -> userRepository.findByRoleIn(List.of(RoleEnum.ASSOCIATE, RoleEnum.ADMIN, RoleEnum.CONSULTANT)); //except super admin (aka access managager)
            case ASSOCIATES -> userRepository.findByRoleIn(List.of(RoleEnum.ASSOCIATE));
            case ADMINS_AND_CONSULTANTS -> userRepository.findByRoleIn(List.of(RoleEnum.ADMIN, RoleEnum.CONSULTANT));
        };

        return recipients.stream()
                .map(MailingRecipientResponseDto::new)
                .toList();
    }

    public int sendMailing(SendMailingDto data) {
        data.emails().forEach(email -> emailService.sendEmail(email, data.subject(), data.message()));
        return data.emails().size();
    }
}
