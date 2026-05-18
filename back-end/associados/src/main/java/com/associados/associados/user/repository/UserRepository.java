package com.associados.associados.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.CategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByEmail(String email);

    List<User> findByCategory(CategoryEnum category);

    Optional<User> findByCpf(String cpf);
}
