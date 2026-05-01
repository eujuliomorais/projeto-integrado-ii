package com.associados.associados.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.associados.associados.auth.dtos.request.ForgotPasswordRequestDto;
import com.associados.associados.auth.dtos.request.ResetPasswordDto;
import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.auth.enums.TokenType;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.repository.AuthTokenRepository;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@Service
public class PasswordRecoveryService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthTokenRepository tokenRepository;

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

        tokenRepository.deleteByUserEmailAndType(user.getEmail(),TokenType.FORGOT_PASSWORD);
        tokenRepository.flush();

        String token = generateNumericToken(6);

        AuthToken resetToken = new AuthToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setType(TokenType.FORGOT_PASSWORD); 
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordDto data) {

        AuthToken resetToken = tokenRepository.findByTokenAndType(data.token(), TokenType.FORGOT_PASSWORD)
                .orElseThrow(() -> new BusinessException("Recovery token invalid or expired."));

        if (resetToken.isExpired()) {
            throw new BusinessException("Recovery token expired.");
        }
        
        if (resetToken.isUsed()) {
            throw new BusinessException("Recovery token already used.");
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(data.newPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
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