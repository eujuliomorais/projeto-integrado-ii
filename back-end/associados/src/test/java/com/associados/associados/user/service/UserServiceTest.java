package com.associados.associados.user.service;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.associados.associados.auth.dtos.request.RegisterUserDto;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User createFakeUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Testador");
        user.setEmail("john@example.com");
        user.setRole(RoleEnum.ADMIN);
        return user;
    }

    @Test
    @DisplayName("Should create user successfully when email is unique")
    void testCreateUserSucess() {
        
        RegisterUserDto data = new RegisterUserDto("test@test.com", "password123", "John Doe", RoleEnum.ADMIN);
        when(userRepository.findByEmail(data.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        
        User savedUser = createFakeUser();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponseDto result = userService.createUser(data);

        assertThat(result).isNotNull();
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    @DisplayName("Should fail to create user when email already exists")
    void testCreateUserFailEmailExists() {

        RegisterUserDto data = new RegisterUserDto("existing@test.com", "password123", "John Doe", RoleEnum.ADMIN);
        when(userRepository.findByEmail(data.email())).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> userService.createUser(data))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("E-mail já cadastrado.");
        
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when Admin is created without password")
    void testCreateUserFailNoPassword() {
        
        RegisterUserDto data = new RegisterUserDto("admin@test.com", "", "Admin User", RoleEnum.ADMIN);
        when(userRepository.findByEmail(data.email())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser(data))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Consultores e Administradores precisam de senha.");
    }

    @Test
    @DisplayName("Should delete user successfully when ID exists")
    void testDeleteUserSuccess() {

        UUID id = UUID.randomUUID();
        when(userRepository.existsById(id)).thenReturn(true);

        userService.deleteUser(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existing user")
    void testDeleteUserFail() {

        UUID id = UUID.randomUUID();
        when(userRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(id))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuário não existe.");
    }

    @Test
    @DisplayName("Should get user by email successfully")
    void testGetUserByEmail() {
        String email = "find@me.com";
        User user = createFakeUser();
        user.setEmail(email);
        user.setRole(RoleEnum.ADMIN);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserResponseDto result = userService.getUserByEmail(email);

        assertThat(result.email()).isEqualTo(email);
    }

    @Test
    @DisplayName("Should update user name successfully")
    void testUpdateName() {

        UUID id = UUID.randomUUID();
        User user = createFakeUser();
        user.setName("Old Name");
        
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDto result = userService.updateName(id, "New Name");

        assertThat(result.name()).isEqualTo("New Name");
        verify(userRepository).save(user);
    }
}