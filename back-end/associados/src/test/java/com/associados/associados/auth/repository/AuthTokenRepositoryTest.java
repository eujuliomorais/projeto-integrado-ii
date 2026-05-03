package com.associados.associados.auth.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.associados.associados.auth.entity.AuthToken;
import com.associados.associados.auth.enums.TokenType;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;

@DataJpaTest
@ActiveProfiles("tests")
class AuthTokenRepositoryTest {

    @Autowired
    private AuthTokenRepository authTokenRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User createAndPersistUser(String email) {
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword("123456");
        user.setRole(RoleEnum.ADMIN);
        return entityManager.persist(user);
    }

    private AuthToken createAndPersistToken(User user, String tokenValue, TokenType type) {
        AuthToken token = new AuthToken();
        token.setToken(tokenValue);
        token.setUser(user);
        token.setType(type);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        token.setUsed(false);
        return entityManager.persist(token);
    }

    @Test
    @DisplayName("Should find token by value and type")
    void testFindByTokenAndType() {
        
        User user = createAndPersistUser("find@test.com");
        createAndPersistToken(user, "123456", TokenType.FORGOT_PASSWORD);

        Optional<AuthToken> found = authTokenRepository.findByTokenAndType("123456", TokenType.FORGOT_PASSWORD);

        assertThat(found).isPresent();
        assertThat(found.get().getToken()).isEqualTo("123456");
        assertThat(found.get().getUser().getEmail()).isEqualTo("find@test.com");
    }

    @Test
    @DisplayName("Should delete tokens by user email and type")
    void testDeleteByUserEmailAndType() {
        
        String email = "delete@test.com";
        User user = createAndPersistUser(email);
        createAndPersistToken(user, "111222", TokenType.FORGOT_PASSWORD);
        
        authTokenRepository.deleteByUserEmailAndType(email, TokenType.FORGOT_PASSWORD);
        entityManager.flush(); 
        entityManager.clear(); 

        Optional<AuthToken> found = authTokenRepository.findByTokenAndType("111222", TokenType.FORGOT_PASSWORD);
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should delete tokens by user object and type")
    void testDeleteByUserAndType() {

        User user = createAndPersistUser("user-obj@test.com");
        createAndPersistToken(user, "333444", TokenType.FORGOT_PASSWORD);

        authTokenRepository.deleteByUserAndType(user, TokenType.FORGOT_PASSWORD);
        entityManager.flush();
        entityManager.clear();

        Optional<AuthToken> found = authTokenRepository.findByTokenAndType("333444", TokenType.FORGOT_PASSWORD);
        assertThat(found).isEmpty();
    }
}