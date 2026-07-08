package com.associados.associados.auth.service;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @DisplayName("Should return UserDetails when user is found by email")
    void testLoadUserByUsernameSuccess() {
        
        String email = "found@test.com";
        User user = new User();
        user.setEmail(email);
        
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserDetails result = userDetailsService.loadUserByUsername(email);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("Should throw UsernameNotFoundException when user email does not exist")
    void testLoadUserByUsernameNotFound() {

        String email = "notfound@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(email))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found: " + email);
        
        verify(userRepository, times(1)).findByEmail(email);
    }
}