package com.associados.associados.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.auth.enums.TokenType;
import com.associados.associados.user.entity.User;

import jakarta.transaction.Transactional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, UUID> {
    
    Optional<AuthToken> findByTokenAndType(String token, TokenType type);
    
    @Transactional
    void deleteByUserEmailAndType(String email, TokenType type);

    @Transactional
    void deleteByUserAndType(User user, TokenType type);
}
