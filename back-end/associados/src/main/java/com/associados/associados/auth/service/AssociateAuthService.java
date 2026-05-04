package com.associados.associados.auth.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.auth.enums.TokenType;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.auth.repository.AuthTokenRepository;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@Service
public class AssociateAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JWTService jwtService;

    @Transactional
    public void sendLoginToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado."));

        if (user.getRole() != RoleEnum.ASSOCIATE) {
            throw new BusinessException("Este fluxo de login é exclusivo para associados.");
        }

        tokenRepository.deleteByUserEmailAndType(email, TokenType.ASSOCIATE_LOGIN);

        String token = generateNumericToken(6);

        AuthToken loginToken = new AuthToken();
        loginToken.setToken(token);
        loginToken.setUser(user);
        loginToken.setType(TokenType.ASSOCIATE_LOGIN);
        loginToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        loginToken.setUsed(false);

        tokenRepository.save(loginToken);

        emailService.sendAssociateLoginEmail(user.getEmail(), token);
    }

    @Transactional
    public String authenticateByToken(String tokenValue) {
        AuthToken authToken = tokenRepository.findByTokenAndType(tokenValue, TokenType.ASSOCIATE_LOGIN)
                .orElseThrow(() -> new BusinessException("Token de login inválido ou expirado."));

        if (authToken.isExpired() || authToken.isUsed()) {
            throw new BusinessException("Token expirado ou já utilizado.");
        }

        authToken.setUsed(true);
        tokenRepository.save(authToken);

        return jwtService.generateToken(authToken.getUser());
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