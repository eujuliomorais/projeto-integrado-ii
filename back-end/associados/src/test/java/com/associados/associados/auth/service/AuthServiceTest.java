package com.associados.associados.auth.service;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.associados.associados.auth.dtos.request.AccessKeyLoginDto;
import com.associados.associados.auth.dtos.request.LoginAdminDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Nested
    @DisplayName("Tests for login (Admin)")
    @SuppressWarnings("unused")
    class LoginAdminTests {

        @Test
        @DisplayName("Should login successfully and return token when credentials are valid")
        void testLoginSuccess() {

            LoginAdminDto loginDto = new LoginAdminDto("admin@test.com", "password123");
            User user = new User();
            user.setEmail("admin@test.com");
            
            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(user);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
            
            when(jwtService.generateToken(user)).thenReturn("fake-jwt-token");

            LoginResponseDto result = authService.login(loginDto);

            assertThat(result.token()).isEqualTo("fake-jwt-token");
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Should throw BadCredentialsException when authentication fails")
        void testLoginFail() {
            LoginAdminDto loginDto = new LoginAdminDto("wrong@test.com", "pass");
            when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid"));

            assertThatThrownBy(() -> authService.login(loginDto))
                .isInstanceOf(BadCredentialsException.class);
        }
    }

    @Nested
    @DisplayName("Tests for loginAccessManager (Access Key)")
    @SuppressWarnings("unused") 
    class LoginAccessManagerTests {

        @Test
        @DisplayName("Should login successfully with valid access key")
        void testLoginAccessKeySuccess() {
            
            AccessKeyLoginDto dto = new AccessKeyLoginDto("secret-key");
            User superAdmin = new User();
            superAdmin.setAccessKeyHash("hashed-key");
            
            when(userRepository.findByRole(RoleEnum.SUPER_ADMIN)).thenReturn(Optional.of(superAdmin));
            when(passwordEncoder.matches("secret-key", "hashed-key")).thenReturn(true);
            when(jwtService.generateToken(superAdmin)).thenReturn("access-key-token");

            LoginResponseDto result = authService.loginAccessManager(dto);

            assertThat(result.token()).isEqualTo("access-key-token");
        }

        @Test
        @DisplayName("Should throw BusinessException when Super Admin does not exist")
        void testSuperAdminNotFound() {
            AccessKeyLoginDto dto = new AccessKeyLoginDto("key");
            when(userRepository.findByRole(RoleEnum.SUPER_ADMIN)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.loginAccessManager(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Super Admin not found");
        }

        @Test
        @DisplayName("Should throw BusinessException when access key is invalid")
        void testInvalidAccessKey() {
            AccessKeyLoginDto dto = new AccessKeyLoginDto("wrong-key");
            User superAdmin = new User();
            superAdmin.setAccessKeyHash("hashed-key");

            when(userRepository.findByRole(RoleEnum.SUPER_ADMIN)).thenReturn(Optional.of(superAdmin));
            when(passwordEncoder.matches("wrong-key", "hashed-key")).thenReturn(false);

            assertThatThrownBy(() -> authService.loginAccessManager(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Invalid access key");
        }

        @Test
        @DisplayName("Should throw BusinessException when access key is not configured")
        void testAccessKeyNotConfigured() {
            AccessKeyLoginDto dto = new AccessKeyLoginDto("any-key");
            User superAdmin = new User();
            superAdmin.setAccessKeyHash(null);

            when(userRepository.findByRole(RoleEnum.SUPER_ADMIN)).thenReturn(Optional.of(superAdmin));

            assertThatThrownBy(() -> authService.loginAccessManager(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Access key not configured for Super Admin");
        }
    }
}