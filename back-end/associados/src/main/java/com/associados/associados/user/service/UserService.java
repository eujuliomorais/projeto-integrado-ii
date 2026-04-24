package com.associados.associados.user.service;


import com.associados.associados.auth.dtos.request.RegisterUserDto;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(RegisterUserDto data) {
        if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        User newUser = new User();
        newUser.setName(data.name());
        newUser.setEmail(data.email());
        newUser.setRole(data.role());

        if (data.role() != RoleEnum.ASSOCIATE) {
            if (data.password() == null || data.password().isEmpty()) {
                throw new RuntimeException("Consultores e Administradores precisam de senha.");
            }
            newUser.setPassword(passwordEncoder.encode(data.password()));
        }

        return new UserResponseDto(userRepository.save(newUser));
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserResponseDto::new)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserResponseDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponseDto::new)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public UserResponseDto updateEmail(UUID id, String newEmail) {
        User user = findUserOrThrow(id);
        user.setEmail(newEmail);
        return new UserResponseDto(userRepository.save(user));
    }

    public UserResponseDto updateName(UUID id, String newName) {
        User user = findUserOrThrow(id);
        user.setName(newName);
        return new UserResponseDto(userRepository.save(user));
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não existe.");
        }
        userRepository.deleteById(id);
    }

    private User findUserOrThrow(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}

