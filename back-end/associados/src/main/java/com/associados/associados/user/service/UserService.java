package com.associados.associados.user.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.associados.associados.auth.dtos.request.RegisterAssociateRequest;
import com.associados.associados.auth.dtos.request.RegisterManagementUserDto;
import com.associados.associados.user.dtos.response.UserCompleteResponseDto;
import com.associados.associados.user.enums.CategoryEnum;
import com.associados.associados.user.enums.Role;
import com.associados.associados.user.exceptions.ResourceNotFoundException;
import com.associados.associados.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserCompleteResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserCompleteResponseDto::fromEntity)
                .toList();
    }

    public UserCompleteResponseDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserCompleteResponseDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserCompleteResponseDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserCompleteResponseDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<UserCompleteResponseDto> getUsersByCategory(CategoryEnum category) {
        return userRepository.findByCategory(category)
                .stream()
                .map(UserCompleteResponseDto::fromEntity)
                .toList();
    }

    public void deleteUserById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public void patchUserRole(String email, Role newRole) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setRole(newRole);
        userRepository.save(user);
    }

    @Transactional
    public void updateUserAdmin(RegisterManagementUserDto data) {
        var user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + data.email()));

        user.setName(data.name());
        user.setCpf(data.cpf());
        user.setPhoneNumber(data.phoneNumber());
        user.setRole(data.role());

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        user.setPassword(encryptedPassword);

        user.setEmail(data.email());

        userRepository.save(user);
    }

    @Transactional
    public void updateUserAssociate(RegisterAssociateRequest data) {
        var user = userRepository.findByEmail(data.managementData().email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + data.managementData().email()));

        user.setName(data.managementData().name());
        user.setCpf(data.managementData().cpf());
        user.setPhoneNumber(data.managementData().phoneNumber());
        user.setRole(Role.ASSOCIATE);

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.managementData().password());
        user.setPassword(encryptedPassword);

        var userData = data.userData();
        
        user.setBirthDate(userData.birthDate());
        user.setCategory(userData.workCategory());
        user.setPostalCode(userData.postalCode());
        user.setStreet(userData.street());
        user.setNumber(userData.number());
        user.setNeighborhood(userData.neighborhood());
        user.setCity(userData.city());
        user.setState(userData.state());
        user.setRace(userData.race());
        user.setSexualOrientation(userData.sexualOrientation());
        user.setEducation(userData.education());
        user.setDisabilities(userData.disabilities());

        if (userData.birthDate().isAfter(LocalDate.now().minusYears(18))) {
            user.setLegalGuardianName(userData.LegalGuardianName());
        } else {
            user.setLegalGuardianName(""); 
        }
        userRepository.save(user);
    }
        



}