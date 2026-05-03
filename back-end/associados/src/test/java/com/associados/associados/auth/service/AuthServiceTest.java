package com.associados.associados.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.associados.associados.auth.dtos.request.LoginDto;
import com.associados.associados.auth.dtos.response.LoginResponseDto;
import com.associados.associados.user.entity.User;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should login successfully and return token when credentials are valid")
    void testLoginSuccess() {

        LoginDto loginDto = new LoginDto("test@example.com", "password123");
        User user = new User();
        user.setEmail("test@example.com");
        
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(auth);
        
        String fakeToken = "jwt-token-xyz";
        when(jwtService.generateToken(user)).thenReturn(fakeToken);

        LoginResponseDto result = authService.login(loginDto);

        assertThat(result).isNotNull();
        assertThat(result.token()).isEqualTo(fakeToken);
        assertThat(result.message()).isEqualTo("Login successful");
        
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken(user);
    }
    
    @Test
    @DisplayName("Should throw exception when authentication fails")
    void testLoginFailInvalidCredentials() {

        LoginDto loginDto = new LoginDto("wrong@example.com", "wrongpass");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> authService.login(loginDto))
            .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should propagate generic exceptions")
    void testLoginGenericError() {
        LoginDto loginDto = new LoginDto("error@example.com", "123");
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Unexpected Error"));

        assertThatThrownBy(() -> authService.login(loginDto))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Unexpected Error");
    }
}