package com.associados.associados.user.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.dtos.request.UpdateProfileDto;
import com.associados.associados.user.dtos.response.UserResponseDto;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccessManagementService {

    private final UserRepository userRepository;

    public Page<UserResponseDto> listUsers(UUID requesterId, Pageable pageable) {
        User requester = findUserOrThrow(requesterId);
        validateAdminAccess(requester);

        if (requester.getRole() == RoleEnum.SUPER_ADMIN) {
            log.info("SUPER_ADMIN {} listing all users", requester.getId());
            return userRepository.findAll(pageable).map(UserResponseDto::new);
        } else if (requester.getRole() == RoleEnum.ADMIN) {
            log.info("ADMIN {} listing ASSOCIATE users", requester.getId());
            return userRepository.findByRole(RoleEnum.ASSOCIATE, pageable).map(UserResponseDto::new);
        }

        throw new BusinessException("User does not have permission to list users");
    }

    public UserResponseDto getUserById(UUID requesterId, UUID targetUserId) {
        User requester = findUserOrThrow(requesterId);
        User targetUser = findUserOrThrow(targetUserId);

        validateAdminAccess(requester);
        validateCanViewUser(requester, targetUser);

        return new UserResponseDto(targetUser);
    }

    @Transactional
    public UserResponseDto updateUserRole(UUID requesterId, UUID targetUserId, RoleEnum newRole) {
        User requester = findUserOrThrow(requesterId);
        User targetUser = findUserOrThrow(targetUserId);

        validateAdminAccess(requester);
        validateCanManageUser(requester, targetUser);
        validateRoleChange(newRole);

        log.info("User {} updating role of {} from {} to {}",
            requester.getId(), targetUserId, targetUser.getRole(), newRole);

        targetUser.setRole(newRole);
        return new UserResponseDto(userRepository.save(targetUser));
    }

    @Transactional
    public UserResponseDto toggleUserActive(UUID requesterId, UUID targetUserId, boolean active) {
        User requester = findUserOrThrow(requesterId);
        User targetUser = findUserOrThrow(targetUserId);

        validateAdminAccess(requester);
        validateCanManageUser(requester, targetUser);

        log.info("User {} setting active status of {} to {}",
            requester.getId(), targetUserId, active);

        targetUser.setActive(active);
        return new UserResponseDto(userRepository.save(targetUser));
    }

    @Transactional
    public UserResponseDto updateProfile(UUID userId, UpdateProfileDto data) {
        User user = findUserOrThrow(userId);

        if (!user.getEmail().equals(data.email()) && userRepository.findByEmail(data.email()).isPresent()) {
            throw new BusinessException("Email is already in use");
        }

        log.info("User {} updating profile", userId);

        user.setName(data.fullName());
        user.setEmail(data.email());

        return new UserResponseDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(UUID requesterId, UUID targetUserId) {
        User requester = findUserOrThrow(requesterId);
        User targetUser = findUserOrThrow(targetUserId);

        validateAdminAccess(requester);
        validateCanManageUser(requester, targetUser);

        if (requester.getId().equals(targetUser.getId())) {
            throw new BusinessException("Cannot delete your own user account");
        }

        log.info("User {} deleted user {}", requester.getId(), targetUserId);
        userRepository.delete(targetUser);
    }

    private void validateAdminAccess(User requester) {
        if (requester.getRole() != RoleEnum.SUPER_ADMIN && requester.getRole() != RoleEnum.ADMIN) {
            throw new BusinessException("User does not have permission to access management features");
        }
    }

    private void validateCanManageUser(User requester, User targetUser) {
        if (requester.getRole() == RoleEnum.SUPER_ADMIN) {
            return;
        }

        if (requester.getRole() == RoleEnum.ADMIN) {
            if (targetUser.getRole() != RoleEnum.ASSOCIATE) {
                throw new BusinessException("ADMIN can only manage ASSOCIATE users");
            }
            return;
        }

        throw new BusinessException("User does not have permission to manage other users");
    }

    private void validateCanViewUser(User requester, User targetUser) {
        if (requester.getRole() == RoleEnum.SUPER_ADMIN) {
            return;
        }

        if (requester.getRole() == RoleEnum.ADMIN) {
            if (targetUser.getRole() != RoleEnum.ASSOCIATE) {
                throw new BusinessException("ADMIN can only view ASSOCIATE users");
            }
            return;
        }

        throw new BusinessException("User does not have permission to view this user");
    }

    private void validateRoleChange(RoleEnum newRole) {
        if (newRole == RoleEnum.SUPER_ADMIN) {
            throw new BusinessException("Cannot assign SUPER_ADMIN role");
        }
    }

    private User findUserOrThrow(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new BusinessException("User not found"));
    }
}
