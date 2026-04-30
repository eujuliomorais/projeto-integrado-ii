package com.associados.associados.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.associados.associados.auth.entity.PasswordResetToken;
import com.associados.associados.user.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    
    void deleteByUserEmail(String email);

    
    void deleteByUser(User user);
}