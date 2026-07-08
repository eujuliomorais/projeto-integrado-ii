package com.associados.associados.user.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.tika.Tika;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.associados.associados.auth.dtos.request.RegisterAdminDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Path ROOT_LOCATION = Paths.get("/app/uploads");

    public UserResponseDto createUser(RegisterAdminDto data) {
        if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new BusinessException("Email already registered.");
        }

        User newUser = new User();
        newUser.setName(data.fullName());
        newUser.setEmail(data.email());
        newUser.setCpf(data.cpf());
        newUser.setPhone(data.phone());
        newUser.setRole(data.role());

        if (data.role() != RoleEnum.ASSOCIATE) {
            if (data.password() == null || data.password().isEmpty()) {
                throw new BusinessException("Consultants and Administrators need a password.");
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
                .orElseThrow(() -> new BusinessException("User not found"));
    }

    public UserResponseDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponseDto::new)
                .orElseThrow(() -> new BusinessException("User not found"));
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
            throw new BusinessException("User does not exist.");
        }
        userRepository.deleteById(id);
    }

    private User findUserOrThrow(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found"));
    }

    @Transactional
    public String salvarEAtualizarAvatar(UUID userId, MultipartFile file) {
        validateImage(file);
        ensureUploadDirectoryExists();

        User user = findUserOrThrow(userId);
        deleteAvatarFileIfPresent(user);

        String safeFileName = UUID.randomUUID() + ".jpg";
        Path destinationFile = ROOT_LOCATION.resolve(safeFileName).normalize();

        try {
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException("Critical error while saving the image file to the server.");
        }

        String urlAcessoRelativa = "/uploads/" + safeFileName;
        user.setAvatarUrl(urlAcessoRelativa);
        userRepository.save(user);
        return urlAcessoRelativa;
    }

    @Transactional
    public String getAvatarUrl(UUID userId) {
        return findUserOrThrow(userId).getAvatarUrl();
    }

    @Transactional
    public void deleteAvatar(UUID userId) {
        User user = findUserOrThrow(userId);
        deleteAvatarFileIfPresent(user);
        user.setAvatarUrl(null);
        userRepository.save(user);
    }

    @Transactional
    public String patchAvatar(UUID userId, MultipartFile file) {
        return salvarEAtualizarAvatar(userId, file);
    }

    private void validateImage(MultipartFile file) {
        try {
            Tika tika = new Tika();
            String detectedType = tika.detect(file.getInputStream());
            if (!detectedType.startsWith("image/")) {
                throw new BusinessException("The file you uploaded is not a valid image.");
            }
        } catch (IOException e) {
            throw new BusinessException("Failed to analyze file integrity.");
        }
    }

    private void ensureUploadDirectoryExists() {
        try {
            if (!Files.exists(ROOT_LOCATION)) {
                Files.createDirectories(ROOT_LOCATION);
            }
        } catch (IOException e) {
            throw new BusinessException("The storage directory could not be created.");
        }
    }

    private void deleteAvatarFileIfPresent(User user) {
        String avatarUrl = user.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return;
        }

        String fileName = avatarUrl.startsWith("/uploads/")
                ? avatarUrl.substring("/uploads/".length())
                : avatarUrl;

        Path existingFile = ROOT_LOCATION.resolve(fileName).normalize();
        try {
            Files.deleteIfExists(existingFile);
        } catch (IOException e) {
            throw new BusinessException("It was not possible to remove the old image from storage.");
        }
    }
}
