package com.associados.associados.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;

@ExtendWith(MockitoExtension.class)
class JWTServiceTest {

    @InjectMocks
    private JWTService jwtService;

    private final String SECRET_TEST = "my-secret-key-for-testing-purposes";

    private void setUp() {
        ReflectionTestUtils.setField(jwtService, "secret", SECRET_TEST);
    }

    private User createFakeUser() {
        User user = new User();
        user.setEmail("auth-test@example.com");
        user.setRole(RoleEnum.ADMIN);
        return user;
    }

    @Test
    @DisplayName("Should generate a valid token containing user email and role")
    void testGenerateTokenSuccess() {
        setUp();
        User user = createFakeUser();

        String token = jwtService.generateToken(user);

        assertThat(token).isNotNull();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("Should validate a correct token and return the subject (email)")
    void testValidateTokenSuccess() {
        setUp();
        User user = createFakeUser();
        String token = jwtService.generateToken(user);

        String subject = jwtService.validateToken(token);

        assertThat(subject).isEqualTo(user.getEmail());
    }

    @Test
    @DisplayName("Should return null when token is invalid or corrupted")
    void testValidateTokenInvalid() {
        setUp();
        String invalidToken = "invalid.token.string";

        String subject = jwtService.validateToken(invalidToken);

        assertThat(subject).isNull();
    }

    @Test
    @DisplayName("Should return null when token is signed with a different secret")
    void testValidateTokenDifferentSecret() {
        setUp();
        JWTService anotherService = new JWTService();
        ReflectionTestUtils.setField(anotherService, "secret", "WRONG_SECRET_123");
        
        String maliciousToken = anotherService.generateToken(createFakeUser());

        String subject = jwtService.validateToken(maliciousToken);

        assertThat(subject).isNull();
    }
}
