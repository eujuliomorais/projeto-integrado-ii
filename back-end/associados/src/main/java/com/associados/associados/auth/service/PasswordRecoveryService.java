package com.associados.associados.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.entity.PasswordResetToken;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.repository.PasswordResetTokenRepository;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@Service
public class PasswordRecoveryService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void createPasswordResetToken(ForgotPasswordRequestDto data) {
        
        User user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new BusinessException("If the user exists, a recovery email has been sent."));

        
        if (user.getRole() == RoleEnum.ASSOCIATE) {
            throw new BusinessException("Associate access is performed via email token.");
        }

        tokenRepository.deleteByUserEmail(user.getEmail());

        tokenRepository.flush();

        String token = generateNumericToken(6);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordDto data) {

        PasswordResetToken resetToken = tokenRepository.findByToken(data.token())
                .orElseThrow(() -> new BusinessException("Recovery token invalid or expired."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new BusinessException("Recovery token expired.");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(data.newPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

    private String generateNumericToken(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    
}