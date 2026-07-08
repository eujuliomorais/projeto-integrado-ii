package com.associados.associados.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByRole(RoleEnum role);
    Page<User> findByRole(RoleEnum role, Pageable pageable);
    List<User> findByRoleIn(List<RoleEnum> roles);
    Page<User> findByRoleNot(RoleEnum role, Pageable pageable);
}
